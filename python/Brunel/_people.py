
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

        self._log = []

    def addLog(self, log):
        self._log.append(log)

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
            existing = None

        if existing is None:
            try:
                existing = self.getByFuzzyName(person)
            except Exception as e:
                existing = None

            if existing:
                self.addLog(f"Have fuzzy matched {person.getName()} "
                            f"to {existing.getName()}")

        if existing:
            del self._names[existing.getName()]
            existing = existing.merge(person)
            self._names[existing.getName()] = existing.getID()
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

    def getLog(self):
        if len(self._log) == 0:
            return None
        else:
            return "\n".join(self._log)

    def values(self):
        return self.state["registry"].values()

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Person with ID {id}")

    def getByFuzzyName(self, person):
        # find all people with matching surname
        surname = person.getSurname()

        for (pid, p) in self.state["registry"].items():
            if p.couldBe(person):
                y = input(f"Is {person.getName()} the same person "
                          f"as {p.getName()}? (y/n) ")

                if y and y.lower()[0] == "y":
                    return p

        return None

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Person with name {name}")

    def getAll(self):
        """ Returns all the names stored in this object

            Returns:
                dict: Dictionary of people as name: ID pairs
        """
        return {v: k for k, v in self._names.items()}

    def getAllForImages(self):
        """ Returns all the names stored in this object

            Returns:
                dict: Dictionary of people as name: ID pairs
        """
        imageDict = {}
        for id, name in self.getAll().items():
            imageDict[id] = {}
            imageDict[id]["name"] = name
            imageDict[id]["filename"] = "file.jpg"

        return imageDict

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
