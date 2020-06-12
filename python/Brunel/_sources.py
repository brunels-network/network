
from ._source import Source as _Source

__all__ = ["Sources"]


def _generate_source_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "S" + str(uid)[:7]


class Sources:
    """This holds a registry of individual Sources"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, source: _Source):
        if source is None:
            return None

        if isinstance(source, str):
            if len(source) == 0:
                return None

            # try to find an existing source with this name
            try:
                return self.getByName(source)
            except Exception:
                return self.add(_Source({"name": source}))

        if not isinstance(source, _Source):
            raise TypeError("Can only add a Source to Sources")

        try:
            return self.getByName(source.getName())
        except Exception:
            pass

        id = source.getID()

        if id:
            print(self.state["registry"])
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Source ID {source}")

            self.state["registry"][id] = source
        else:
            uid = _generate_source_uid()

            while uid in self.state["registry"]:
                uid = _generate_source_uid()

            source.state["id"] = uid
            # source.state["id"] = {"id": uid, "name": source.getName()}
            self.state["registry"][uid] = source

        source._getHook = self._getHook
        self._names[source.getName()] = source.getID()
        return source

    def update(self, new):
        try:
            old = self.get(new.getID())
        except Exception:
            return self.add(new)

        if old.getName() != new.getName():
            raise ValueError(f"Cannot change name in update! f{old} vs {new}")

        self.state["registry"][new.getID()] = new

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Source with name {name}")

    def find(self, value):
        if isinstance(value, _Source):
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

        raise KeyError(f"No source matches '{value}'. Available sources " +
                       f"are '{keys}'")

    def getRegistry(self):
        """ Outputs the state registry of UID: Source name pairs
            for use in matching images of correspondence.

            Returns:
                dict: Source UID: source name pair
                For example:
                S4dffc36: DM162/10/2b-7, 58
        """
        return {uid: source.getName() for uid, source in self.state["registry"].items()}

    def getRegistryForImages(self):
        """ Outputs the state registry of UID: Source name pairs
            for use in matching images of correspondence.

            Returns:
                dict: Source UID: source name pair
                For example:
                S4dffc36: DM162/10/2b-7, 58
        """
        imageDict = {}
        for uid, source in self.state["registry"].items():
            imageDict[uid] = {}
            imageDict[uid]["name"] = source.getName()
            imageDict[uid]["filename"] = "file.jpg"

        return imageDict

    def getSourceNames(self):
        return sorted([source.getName() for source in self.state["registry"].values()])

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Note with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                note = _Source.load(item)
                self.add(note)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        sources = Sources()
        sources.state = value

        return sources
