
__all__ = ["Person"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except:
        return default


class Person:
    """Holds information about a Person in the network"""
    def __init__(self, props=None):
        self.state = {
            "name": None,
            "id": None,
            "positions": {},
            "affiliations": {},
            "projects": {},
            "sources": [],
            "dob": None,
            "dod": None,
            "gender": None,
        }

        self.setState(props)

    def getID(self):
        return self.state["id"]

    def setState(self, state):
        if not state:
            return

        self.state["name"] = _setState(state, "name")
        self.state["id"] = _setState(state, "id")
        self.state["positions"] = _setState(state, "positions", {})
        self.state["affiliations"] = _setState(state, "affiliations", {})
        self.state["projects"] = _setState(state, "projects", {})
        self.state["sources"] = _setState(state, "sources", [])
        self.state["dob"] = _setState(state, "dob")
        self.state["dod"] = _setState(state, "dod")
        self.state["gender"] = _setState(state, "gender")

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        return Person(value)

    @staticmethod
    def load(data):
        return Person(data)
