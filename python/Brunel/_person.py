
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


def _mergeName(old, new, key):
    if len(":".join(new[key])) > len(":".join(old[key])):
        old[key] = new[key]


def _mergeNames(old, new):
    for key in ["titles", "firstnames", "surnames", "suffixes"]:
        _mergeName(old, new, key)

    if old["orig_name"] != new["orig_name"]:
        old["orig_name"] = f"{old['orig_name']} or {new['orig_name']}"

def _mergeProjects(old, new, key):
    old = old[key]
    new = new[key]

    for project, values in new.items():
        if project in old:
            for value in values:
                if value not in old[project]:
                    old[project].append(value)
        else:
            old[project] = values


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
            "sources": {},
            "alive": None,
            "gender": None,
            "notes": [],
            "orig_name": None,
        }

        self.setState(props)

    def merge(self, other):
        import copy as _copy
        state = _copy.copy(self.state)

        _mergeNames(state, other.state)

        _mergeProjects(state, other.state, "positions")
        _mergeProjects(state, other.state, "affiliations")
        _mergeProjects(state, other.state, "sources")

        for project, dates in other.state["projects"].items():
            state["projects"][project] = dates

        p = Person()
        p.state = state
        p._getHook = self._getHook

        return p

    def __str__(self):
        return f"Person({self.getName()})"

    def __repr__(self):
        return self.__str__()

    def getID(self):
        return self.state["id"]

    def couldBe(self, other):
        if self.getSurname() != other.getSurname():
            return False

        if self.getInitials() == other.getInitials():
            return True

        if self.firstInitial() == other.firstInitial():
            return True

        return False

    def getFirstName(self):
        try:
            return " ".join(self.state["firstnames"])
        except KeyError:
            return None

    def firstInitial(self):
        try:
            for name in self.state["firstnames"]:
                return name[0].upper()
        except Exception:
            pass

        return None

    def getInitials(self):
        initials = []

        try:
            for name in self.state["firstnames"]:
                initials.append(name[0].upper())
        except Exception:
            pass

        return f"{'.'.join(initials)}."

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
        result = {}

        positions = self.state["positions"]

        for project in positions.keys():
            if project not in result:
                result[project] = []

            for position in positions[project]:
                result[project].append(self._getHook(position))

        return result

    def getAffiliations(self):
        result = {}

        affiliations = self.state["affiliations"]

        for project in affiliations.keys():
            if project not in result:
                result[project] = []

            for affiliation in affiliations[project]:
                result[project].append(self._getHook(affiliation))

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
        self.state["sources"] = _setState(state, "sources", {})
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
