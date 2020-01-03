
__all__ = ["Person"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except KeyError:
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
            "scores": {},
            "alive": None,
            "gender": None,
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        return f"Person({self.getName()})"

    def __repr__(self):
        return self.__str__()

    def getID(self):
        return self.state["id"]

    def getFirstName(self):
        try:
            return " ".join(self.state["firstnames"])
        except KeyError:
            return None

    def getTitle(self):
        try:
            return " ".join(self.state["titles"])
        except KeyError:
            return None

    def getSurname(self):
        try:
            return " ".join(self.state["surnames"])
        except KeyError:
            return None

    def getSuffix(self):
        try:
            return " ".join(self.state["suffixes"])
        except KeyError:
            return None

    def getName(self):
        parts = []

        for part in [self.getTitle, self.getFirstName,
                     self.getSurname, self.getSuffix]:
            n = part()
            if n:
                parts.append(n)

        return " ".join(parts)

    def getPositions(self):
        result = []

        positions = self.state["positions"]

        for position in positions.keys():
            result.append((self._getHook(position), positions[position]))

        return result

    def getAffiliations(self):
        result = []

        affiliations = self.state["affiliations"]

        for affiliation in affiliations.keys():
            result.append((self._getHook(affiliation),
                           affiliations[affiliation]))

        return result

    def getBorn(self):
        try:
            return self.state["alive"].getStart()
        except KeyError:
            return None

    def getDied(self):
        try:
            return self.state["alive"].getEnd()
        except KeyError:
            return None

    def getLifeTime(self):
        try:
            return self.state["alive"]
        except KeyError:
            return None

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
        self.state["scores"] = _setState(state, "scores", {})
        self.state["alive"] = _setState(state, "alive")
        self.state["gender"] = _setState(state, "gender")
        self.state["orig_name"] = _setState(state, "orig_name")
        self.state["notes"] = _setState(state, "notes", [])

        if self.state["orig_name"] == "None" or \
           self.state["orig_name"] is None:
            raise ValueError(f"No name for {self}?")

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        return Person(value)

    @staticmethod
    def load(data):
        return Person(data)
