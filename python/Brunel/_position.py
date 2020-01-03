
__all__ = ["Position"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except Exception:
        return default


class Position:
    """Holds information about a Position in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "name": None,
            "id": None,
            "sources": [],
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Position({self.getName()})"

    def __repr__(self):
        return self.__str__()

    def getID(self):
        return self.state["id"]

    def getName(self):
        return self.state["name"]

    def getCanonical(self):
        return self.state["canonical"]

    @staticmethod
    def makeCanonical(name):
        if not name:
            return None
        else:
            return name.lstrip().rstrip().lower()

    def setState(self, state):
        if not state:
            return

        self.state["name"] = _setState(state, "name")
        self.state["id"] = _setState(state, "id")
        self.state["sources"] = _setState(state, "sources", [])
        self.state["notes"] = _setState(state, "notes", [])
        self.state["canonical"] = Position.makeCanonical(self.state["name"])

        if self.state["name"] == "None" or self.state["name"] is None:
            raise ValueError(f"No name for {self}?")

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        return Position(value)

    @staticmethod
    def load(data):
        return Position(data)
