
__all__ = ["DateRange", "Date"]


def _get_min(d1, d2):
    if d1:
        if d2:
            if d1 < d2:
                return d1
            else:
                return d2
        else:
            return d1
    else:
        return d2


def _get_max(d1, d2):
    if d1:
        if d2:
            if d1 > d2:
                return d1
            else:
                return d2
        else:
            return d1
    else:
        return d2


def _merge_raw(s1, s2):
    if not s1:
        return s2
    elif not s2:
        return s1

    p1 = s1.split(" + ")
    p2 = s2.split(" + ")

    parts = []

    for p in p1:
        if p not in parts:
            parts.append(p)

    for p in p2:
        if p not in parts:
            parts.append(p)

    parts.sort()

    return " + ".join(parts)


class Date:
    """This is a wrapper around a standard date, which has the additional
       ability to be a vague date, e.g. "March 1840", or "1855". It is used
       as many dates that we need cannot be specified exactly
    """
    def __init__(self, date=None):
        if date is None:
            self.state = {}
            return

        if isinstance(date, Date):
            import copy as _copy
            self.__dict__ = _copy.deepcopy(date.__dict__)
            return

        import datetime as _datetime

        if isinstance(date, _datetime.date):
            self.state = {"start": date}
            return

        raw = date.lstrip().rstrip()

        date = raw.lower()

        try:
            date = _datetime.date.fromisoformat(date)
        except Exception:
            pass

        if isinstance(date, _datetime.date):
            self.state = {"start": date}
            return

        if date == "nan" or date == "":
            self.state = {}
            return

        parts = date.split(" ")

        start = None
        end = None

        if len(parts) == 1:
            # this should be a year... or a year range
            year = parts[0]

            try:
                if year.find("-") != -1:
                    years = year.split("-")
                    y0 = int(years[0])
                    y1 = int(years[1])
                    start = _datetime.date(year=y0, month=1, day=1)
                    end = _datetime.date(year=y1, month=12, day=31)
                else:
                    year = int(parts[0])
                    start = _datetime.date(year=year, month=1, day=1)
                    end = _datetime.date(year=year, month=12, day=31)
            except Exception:
                print(f"Unrecognised year? {parts} : {raw}")
                self.state = {}
                return
        else:
            print(f"Unrecognised date? {parts} : {raw}")
            self.state = {}
            return

        if start is None and end is None:
            self.state = {}
            return
        else:
            self.state = {"start": start,
                          "end": end,
                          "raw": raw}

    def __str__(self):
        if self.is_null():
            return "Date:unknown"
        elif self.is_fuzzy():
            return f"~{self.state['start'].isoformat()}" + \
                   f"-{self.state['end'].isoformat()}"
        else:
            return self.state["start"].isoformat()

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        if self.is_fuzzy() and other.is_fuzzy():
            return self.to_range() == other.to_range()
        elif self.is_exact() and other.is_exact():
            return self.start() == other.start()
        else:
            return self.is_null() and other.is_null()

    def __lt__(self, other):
        if self.is_fuzzy() or other.is_fuzzy():
            return self.to_range() < other.to_range()
        elif self.is_null():
            return True
        elif other.is_null():
            return False
        else:
            return self.start() < other.start()

    def __le__(self, other):
        return self.__lt__(other) or self.__eq__(other)

    def __ne__(self, other):
        return not self.__eq__(other)

    def __gt__(self, other):
        return not self.__le__(other)

    def __ge__(self, other):
        return not self.__lt__(other)

    @staticmethod
    def null():
        return Date()

    def is_null(self):
        return "start" not in self.state

    def is_fuzzy(self):
        return "end" in self.state

    def is_exact(self):
        return not (self.is_null() or self.is_fuzzy())

    def to_range(self):
        if self.is_null():
            return DateRange()
        elif self.is_exact():
            return DateRange(both=self.start())
        else:
            return DateRange(start=self.start(), end=self.end())

    def raw(self):
        try:
            return self.state["raw"]
        except KeyError:
            return None

    def start(self):
        try:
            return self.state["start"]
        except KeyError:
            return None

    def end(self):
        try:
            return self.state["end"]
        except KeyError:
            return None

    def merge(self, other):
        state = {"start": _get_min(self.start(), other.start()),
                 "end": _get_max(self.end(), other.end()),
                 "raw": _merge_raw(self.raw(), other.raw())}

        d = Date()
        d.state = state

        return d

    def toDry(self):
        if self.is_null():
            return "null"
        elif self.is_fuzzy():
            return {"start": self.state["start"].isoformat(),
                    "end": self.state["end"].isoformat(),
                    "raw": self.state["raw"]}
        elif self.raw() is None:
            return {"start": self.state["start"].isoformat()}
        else:
            return {"start": self.state["start"].isoformat(),
                    "raw": self.state["raw"]}


class DateRange:
    def __init__(self, start=None, end=None, both=None):
        if both:
            start = both
            end = both

        if start:
            start = Date(start)

        if end:
            end = Date(end)

            if end < start:
                tmp = start
                start = end
                end = tmp

        self.state = {"start": start,
                      "end": end,
                      }

    def getStart(self):
        return self.state["start"]

    def getEnd(self):
        return self.state["end"]

    def __str__(self):
        start = self.getStart()
        end = self.getEnd()

        if start is None:
            if end is None:
                return "DateRange:unknown"
            else:
                return f"DateRange(from=? to={end})"
        elif end is None:
            return f"DateRange(from={start} to=?)"
        else:
            return f"DateRange(from={start} to={end})"

    def __repr__(self):
        return self.__str__()

    def __eq__(self, other):
        return self.getStart() == other.getStart() and \
               self.getEnd() == other.getEnd()

    def __lt__(self, other):
        if self.getStart():
            if other.getStart():
                return self.getStart() < other.getStart()
            else:
                return False
        else:
            return False

    def __le__(self, other):
        return self.__lt__(other) or self.__eq__(other)

    def __ne__(self, other):
        return not self.__eq__(other)

    def __gt__(self, other):
        return not self.__le__(other)

    def __ge__(self, other):
        return not self.__lt__(other)

    @staticmethod
    def null():
        return DateRange()

    def toDry(self):
        state = {}

        start = self.getStart()
        end = self.getEnd()

        if (start is None) and (end is None):
            return "null"

        if start == end:
            state["both"] = start.toDry()
        else:
            if start:
                state["start"] = start.toDry()

            if end:
                state["end"] = end.toDry()

        return state
