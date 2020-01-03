
__all__ = ["DateRange", "Date"]


class Date:
    """This is a wrapper around a standard date, which has the additional
       ability to be a vague date, e.g. "March 1840", or "1855". It is used
       as many dates that we need cannot be specified exactly
    """
    def __init__(self, date):
        if isinstance(date, Date):
            import copy as _copy
            self.__dict__ = _copy.deepcopy(date.__dict__)
            return

        import datetime as _datetime

        if isinstance(date, _datetime.date):
            self.state = {"start": date}
            return

        date = date.lstrip().rstrip()
        self.state = {"source": date}
        date = date.lower()

        try:
            date = _datetime.date.fromisoformat(date)
        except Exception:
            pass

        if isinstance(date, _datetime.date):
            self.state["start"] = date
            del self.state["source"]
            return

        parts = date.split(" ")

        print(parts)
        raise TypeError()

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

    def source(self):
        try:
            return self.state["source"]
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

    def toDry(self):
        if self.is_null():
            return "null"
        elif self.is_fuzzy():
            return {"start": self.state["start"].isoformat(),
                    "end": self.state["end"].isoformat(),
                    "source": self.state["source"]}
        elif self.source() is None:
            return {"start": self.state["start"].isoformat()}
        else:
            return {"start": self.state["start"].isoformat(),
                    "source": self.state["source"]}


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
