
__all__ = ["DateRange"]


class DateRange:
    def __init__(self, start=None, end=None):
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
                return f"DateRange(from={start} to=?)"
        else:
            return f"DateRange(from=? to={end})"

    def __repr__(self):
        return self.__str__()

    @staticmethod
    def null():
        return DateRange()
