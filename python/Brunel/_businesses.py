
from ._business import Business as _Business

__all__ = ["Businesses"]


def _generate_business_uid():
    import uuid as _uuid
    uid =_uuid.uuid4()
    return "B" + str(uid)[:7]


class Businesses:
    """This holds a registry of individual Businesses / Institutions"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self.load(props)

    def add(self, business: _Business):
        if business is None:
            return

        if not isinstance(business, _Business):
            raise TypeError("Can only add a Business to Businesses")

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

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Business with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                business = _Business.load(item)
                self.add(business)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        businesses = Businesses()
        businesses.state = value
        return businesses
