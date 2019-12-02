
__all__ = ["Position"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except:
        return default


class Position:
    """Holds information about a Position in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "name": [],
            "id": None,
            "sources": [],
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Position({self.getName()})"

    def getID(self):
        return self.state["id"]

    def getName(self):
        return self.state["name"]

    def setState(self, state):
        if not state:
            return

        self.state["name"] = _setState(state, "name")
        self.state["id"] = _setState(state, "id")
        self.state["sources"] = _setState(state, "sources", [])
        self.state["notes"] = _setState(state, "notes", [])

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        return Position(value)

    @staticmethod
    def load(data):
        return Position(data)
