
from ._business import Business as _Business

__all__ = ["Businesses"]


def _generate_business_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "B" + str(uid)[:7]


class Businesses:
    """This holds a registry of individual Businesses / Institutions"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, business: _Business):
        if business is None:
            return

        if isinstance(business, str):
            # try to find an existing business with this name
            try:
                return self.getByName(business)
            except Exception:
                return self.add(_Business({"name": business}))

        if not isinstance(business, _Business):
            raise TypeError("Can only add a Business to Businesses")

        try:
            return self.getByName(business.getName())
        except Exception:
            pass

        id = business.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Business ID {business}")

            self.state["registry"][id] = business
        else:
            uid = _generate_business_uid()

            while uid in self.state["registry"]:
                uid = _generate_business_uid()

            business.state["id"] = uid
            self.state["registry"][uid] = business

        business._getHook = self._getHook
        self._names[business.getName()] = business.getID()
        return business

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Business with name {name}")

    def find(self, value):
        if isinstance(value, _Business):
            return self.get(value.getID())

        value = value.lstrip().rstrip().lower()

        results = []

        for name in self._names.keys():
            if name.lower().find(value) != -1:
                results.append(self.get(self._names[name]))

        if len(results) == 1:
            return results[0]
        elif len(results) > 1:
            return results

        keys = "', '".join(self._names.keys())

        raise KeyError(f"No business matches '{value}'. Available businesses "
                       f"are '{keys}'")

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Business with ID {id}")

    def values(self):
        return self.state["registry"].values()

    def load(self, data):
        if data:
            for item in data:
                business = _Business.load(item)
                self.add(business)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        businesses = Businesses()
        businesses.state = value
        return businesses
