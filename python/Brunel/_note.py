
__all__ = ["Note"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except:
        return default


class Note:
    """Holds information about a Note in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "text": None,
            "id": None,
            "sources": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Note({self.getText()})"

    def getID(self):
        return self.state["id"]

    def getText(self):
        return self.state["text"]

    def setState(self, state):
        if not state:
            return

        self.state["text"] = _setState(state, "text")
        self.state["id"] = _setState(state, "id")
        self.state["sources"] = _setState(state, "sources", [])

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        return Note(value)

    @staticmethod
    def load(data):
        return Note(data)
