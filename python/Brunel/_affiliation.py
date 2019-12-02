
__all__ = ["Affiliation"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except:
        return default


class Affiliation:
    """Holds information about an Affiliation in the network"""
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
        return f"Affiliation({self.getName()})"

    def __repr__(self):
        return self.__str__()

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
        return self.state

    @staticmethod
    def unDry(value):
        return Affiliation(value)

    @staticmethod
    def load(data):
        return Affiliation(data)
