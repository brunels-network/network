
import uuid as _uuid
from ._person import Person as _Person

__all__ = ["People"]


def _generate_person_uid():
  uid =_uuid.uuid4()
  return "P" + str(uid)[:7]


class People:
    """This holds a registry of individual Persons"""
    def __init__(self, props=None):
        self._social = None

        self.state = {
            "registry": {},
        }

        self.load(props)

    def add(self, person: _Person):
        if person is None:
            return

        if not isinstance(person, _Person):
            raise TypeError("Can only add a Person to People")

        id = person.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Person ID {person}")

            self.state["registry"][id] = person
        else:
            uid = _generate_person_uid()

            while uid in self.state["registry"]:
                uid = _generate_person_uid()

            person.state["id"] = uid
            self.state["registry"][uid] = person

        person._social = self._social

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Person with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                person = _Person.load(item)
                self.add(person)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        people = People()
        people.state = value
        return people
