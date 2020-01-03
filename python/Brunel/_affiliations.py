
from ._affiliation import Affiliation as _Affiliation

__all__ = ["Affiliations"]


def _generate_affiliation_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "A" + str(uid)[:7]


class Affiliations:
    """This holds a registry of individual
       Affiliations
    """
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, affiliation: _Affiliation):
        if affiliation is None:
            return

        if isinstance(affiliation, str):
            # try to find an existing affiliation with this name
            try:
                return self.getByName(affiliation)
            except Exception:
                return self.add(_Affiliation({"name": affiliation}))

        if not isinstance(affiliation, _Affiliation):
            raise TypeError("Can only add a Affiliation to Affiliations")

        try:
            return self.getByName(affiliation.getName())
        except Exception:
            pass

        id = affiliation.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Affiliation ID {affiliation}")

            self.state["registry"][id] = affiliation
        else:
            uid = _generate_affiliation_uid()

            while uid in self.state["registry"]:
                uid = _generate_affiliation_uid()

            affiliation.state["id"] = uid
            self.state["registry"][uid] = affiliation

        affiliation._getHook = self._getHook
        self._names[affiliation.getName()] = affiliation.getID()

        return affiliation

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Affiliation with name {name}")

    def find(self, value):
        value = value.lstrip().rstrip().lower()

        results = []

        for name in self._names.keys():
            if name.lower().find(value) != -1:
                results.append(self.get(self._names[name]))

        if len(results) == 1:
            return results[0]
        elif len(results) == 0:
            return None
        else:
            return results

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Affiliation with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                affiliation = _Affiliation.load(item)
                self.add(affiliation)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        affiliations = Affiliations()
        affiliations.state = value

        affiliations._names = {}

        for affiliation in affiliations.state["registry"].values():
            affiliations._names[affiliation.getName()] = affiliation.getID()

        return affiliations
