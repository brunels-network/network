
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


def _extractName(state):
    name = str(state["name"]).lstrip().rstrip()

    titles = []
    firstnames = []
    surnames = []
    suffixes = []

    # some special cases
    if name == "Brunel, I.K.":
        firstnames.append("Isambard")
        firstnames.append("Kingdom")
        surnames.append("Brunel")
        state["gender"] = "male"
    elif name == "Wm Symonds":
        firstnames.append("W.")
        firstnames.append("M.")
        surnames.append("Symonds")
    elif name == "Mr John Edye":
        firstnames.append("John")
        surnames.append("Edye")
        titles.append("Mr.")
    else:
        name = name.replace("'", "")
        name = name.replace(".", " ")

        s = name.lower().find("(the elder)")

        if s != -1:
            suffixes.append("(the elder)")
            name = name[0:s]

        parts = name.split(",")

        possible_titles = {"captain" : "Captain",
                           "cpt" : "Captain",
                           "superintendent" : "Superintendent",
                           "dr" : "Dr.",
                           "doctor" : "Dr.",
                           "prof": "Prof.",
                           "mr" : "Mr.",
                           "ms" : "Ms.",
                           "mrs" : "Mrs.",
                           "miss" : "Miss.",
                           "rn" : "RN",
                           "rev" : "Rev."
                          }

        for part in parts[0].split(" "):
            for surname in part.split("."):
                try:
                    titles.append(possible_titles[surname.lower()])
                except:
                    if len(surname) > 0:
                        surnames.append(surname)

        try:
            for part in parts[1].split(" "):
                for firstname in part.split("."):
                    try:
                        titles.append(possible_titles[firstname.lower()])
                    except:
                        if len(firstname) == 1:
                            firstnames.append(f"{firstname}.")
                        elif len(firstname) > 1:
                            firstnames.append(firstname)
        except:
            pass

    state["titles"] = titles
    state["firstnames"] = firstnames
    state["surnames"] = surnames
    state["suffixes"] = suffixes

    if "Mr." in state["titles"]:
        state["gender"] = "male"
    elif "Mrs." in state["titles"] or "Ms." in state["titles"] or \
         "Miss." in state["titles"]:
        state["gender"] = "female"

    return state


class Person:
    """Holds information about a Person in the network"""
    def __init__(self, props=None):
        self._social = None

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

        if "name" in state:
            state = _extractName(state)

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
        self.state["notes"] = _setState(state, "notes")

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        return Person(value)

    @staticmethod
    def load(data):
        return Person(data)
