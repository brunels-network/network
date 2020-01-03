
__all__ = ["Project"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except Exception:
        return default


class Project:
    """Holds information about a Project in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "name": None,
            "id": None,
            "url": None,
            "duration": None,
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Project({self.getName()})"

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
        self.state["url"] = _setState(state, "url")
        self.state["duration"] = _setState(state, "duration")
        self.state["notes"] = _setState(state, "notes", [])

        if self.state["name"] == "None" or self.state["name"] is None:
            raise ValueError(f"No name for {self}?")

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        return Project(value)

    @staticmethod
    def load(data):
        return Project(data)
