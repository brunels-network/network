
from ._person import Person as _Person

__all__ = ["People"]


def _generate_person_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "P" + str(uid)[:7]


class People:
    """This holds a registry of individual Persons"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, person: _Person):
        if person is None:
            return

        if isinstance(person, str):
            # try to find an existing person with this name
            try:
                return self.getByName(person)
            except Exception:
                return self.add(_Person({"name": person}))

        if not isinstance(person, _Person):
            raise TypeError("Can only add a Person to People")

        existing = None

        try:
            existing = self.getByName(person.getName())
        except Exception:
            pass

        if existing:
            existing = existing.merge(person)
            self.state["registry"][existing.getID()] = existing
            return existing

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

        person._getHook = self._getHook
        self._names[person.getName()] = person.getID()
        return person

    def values(self):
        return self.state["registry"].values()

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Person with ID {id}")

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Person with name {name}")

    def find(self, value, best_match=False):
        if isinstance(value, _Person):
            return self.get(value.getID())

        value = value.lstrip().rstrip().lower()

        results = []
        shortest = None
        shortest_length = None

        for name in self._names.keys():
            if name.lower().find(value) != -1:
                if shortest is None:
                    shortest = name
                    shortest_length = len(name)
                elif len(name) < shortest_length:
                    shortest_length = len(name)
                    shortest = name

                results.append(self.get(self._names[name]))

        if len(results) == 1:
            return results[0]
        elif len(results) > 1:
            if best_match:
                return self.get(self._names[shortest])
            else:
                return results

        keys = "', '".join(self._names.keys())

        raise KeyError(f"No person matches '{value}'. Available people " +
                       f"are '{keys}'")

    def load(self, data):
        if data:
            for item in data:
                person = _Person.load(item)
                self.add(person)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        people = People()
        people.state = value
        return people
