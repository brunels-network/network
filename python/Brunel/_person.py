
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
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "titles": [],
            "firstnames": [],
            "surnames": [],
            "suffixes": [],
            "id": None,
            "positions": {},
            "affiliations": {},
            "projects": {},
            "sources": [],
            "dob": None,
            "dod": None,
            "gender": None,
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Person({self.getName()})"

    def getID(self):
        return self.state["id"]

    def getFirstName(self):
        try:
            return " ".join(self.state["firstnames"])
        except:
            return None

    def getTitle(self):
        try:
            return " ".join(self.state["titles"])
        except:
            return None

    def getSurname(self):
        try:
            return " ".join(self.state["surnames"])
        except:
            return None

    def getSuffix(self):
        try:
            return " ".join(self.state["suffixes"])
        except:
            return None

    def getName(self):
        parts = []

        for part in [self.getTitle, self.getFirstName,
                     self.getSurname, self.getSuffix]:
            n = part()
            if n:
                parts.append(n)

        return " ".join(parts)

    def setState(self, state):
        if not state:
            return

        self.state["suffixes"] = _setState(state, "suffixes", [])
        self.state["surnames"] = _setState(state, "surnames", [])
        self.state["firstnames"] = _setState(state, "firstnames", [])
        self.state["titles"] = _setState(state, "titles", [])
        self.state["id"] = _setState(state, "id")
        self.state["positions"] = _setState(state, "positions", {})
        self.state["affiliations"] = _setState(state, "affiliations", {})
        self.state["projects"] = _setState(state, "projects", {})
        self.state["sources"] = _setState(state, "sources", [])
        self.state["dob"] = _setState(state, "dob")
        self.state["dod"] = _setState(state, "dod")
        self.state["gender"] = _setState(state, "gender")
        self.state["orig_name"] = _setState(state, "name")
        self.state["notes"] = _setState(state, "notes", [])

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        return Person(value)

    @staticmethod
    def load(data):
        return Person(data)
