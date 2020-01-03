
__all__ = ["Connection"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except KeyError:
        return default


def _mergeSources(state, other, key):
    state = state[key]
    other = other[key]

    for key, values in other.items():
        if key not in state:
            state[key] = values
        else:
            for value in values:
                if value not in state[key]:
                    state[key].append(value)


class Connection:
    """Holds information about a Connection in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "id": None,
            "n0": None,
            "n1": None,
            "shared": None,
            "type": None,
            "duration": None,
            "affiliations": None,
            "correspondances": None,
            "projects": None,
            "notes": None,
        }

        self.setState(props)

    def setState(self, state):
        if not state:
            return

        self.state["id"] = _setState(state, "id")
        self.state["n0"] = _setState(state, "n0")
        self.state["n1"] = _setState(state, "n1")
        self.state["shared"] = _setState(state, "shared", [])
        self.state["type"] = _setState(state, "type")
        self.state["duration"] = _setState(state, "duration")
        self.state["affiliations"] = _setState(state, "affiliations", {})
        self.state["correspondances"] = _setState(state, "correspondances", {})
        self.state["notes"] = _setState(state, "notes", [])
        self.state["projects"] = _setState(state, "projects", {})

        if self.state["n0"] > self.state["n1"]:
            tmp = self.state["n0"]
            self.state["n0"] = self.state["n1"]
            self.state["n1"] = tmp

    def merge(self, other):
        if not self._getHook:
            if other._getHook:
                return other.merge(self)

        import copy as _copy
        state = _copy.deepcopy(self.state)

        for s in other.state["shared"]:
            if s not in state["shared"]:
                state["shared"].append(s)

        for n in other.state["notes"]:
            state["notes"].append(n)

        _mergeSources(state, other.state, "affiliations")
        _mergeSources(state, other.state, "correspondances")

        state["duration"] = state["duration"].merge(other.state["duration"])

        m = Connection()
        m.state = state
        m._getHook = self._getHook

        return m

    def __str__(self):
        n0 = self.getNode0()
        n1 = self.getNode1()

        if n0 is None or n1 is None:
            return "Connection::null"
        else:
            return f"Connections({self.getNode0Name()} " \
                   f"<=> {self.getNode1Name()})"

    def __repr__(self):
        return self.__str__()

    def getName(self):
        n0 = self.state["n0"]
        n1 = self.state["n1"]

        if n0 <= n1:
            return f"{n0}<=>{n1}"
        else:
            return f"{n1}<=>{n0}"

    def getNode0Name(self):
        node0 = self.getNode0()

        try:
            return node0.getName()
        except Exception:
            return node0

    def getNode1Name(self):
        node1 = self.getNode1()

        try:
            return node1.getName()
        except Exception:
            return node1

    def getNode0(self):
        node0 = self.state["n0"]

        if self._getHook:
            node0 = self._getHook(node0)

        return node0

    def getNode1(self):
        node1 = self.state["n1"]

        if self._getHook:
            node1 = self._getHook(node1)

        return node1

    def getDuration(self):
        return self.state["duration"]

    def getAffiliationSources(self):
        return self.state["affiliations"]

    def getCorrespondanceSources(self):
        return self.state["correspondances"]

    def getID(self):
        return self.state["id"]

    def toDry(self):
        state = {}

        for key, value in self.state.items():
            if value:
                try:
                    if len(value) > 0:
                        state[key] = value
                except Exception:
                    state[key] = value

        return state

    @staticmethod
    def unDry(value):
        return Connection(value)

    @staticmethod
    def load(data):
        return Connection(data)
