
__all__ = ["Source"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except Exception:
        return default


class Source:
    """Holds information about a Source in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "name": None,
            "id": None,
            "date": None,
            "description": None,
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Source({self.getName()})"

    def __repr__(self):
        return self.__str__()

    def getID(self):
        return self.state["id"]

    def getName(self):
        return self.state["name"]

    def getDate(self):
        return self.state["date"]

    def updateDate(self, date, force=False):
        from ._daterange import Date as _Date

        if not isinstance(date, _Date):
            date = _Date(date)

        if date.is_null():
            return False

        if self.getDate().is_null():
            self.state["date"] = date
            return True

        if self.getDate() != date:
            if force:
                self.state["date"] = self.getDate().merge(date)
                return True
            else:
                print(f"Disagreement of date for {self.__str__()}. "
                      f"{self.getDate()} vs. {date}")

        return False

    def setState(self, state):
        if not state:
            return

        from ._daterange import Date as _Date

        self.state["name"] = _setState(state, "name")
        self.state["id"] = _setState(state, "id")
        self.state["description"] = _setState(state, "description")
        self.state["date"] = _setState(state, "date", _Date.null())
        self.state["notes"] = _setState(state, "notes", [])

        if self.state["name"] == "None" or self.state["name"] is None:
            raise ValueError(f"No name for {self}?")

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        return Source(value)

    @staticmethod
    def load(data):
        return Source(data)
