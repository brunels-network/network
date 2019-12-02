
from ._source import Source as _Source

__all__ = ["Sources"]


def _generate_source_uid():
    import uuid as _uuid
    uid =_uuid.uuid4()
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
            return

        if isinstance(source, str):
            # try to find an existing source with this name
            try:
                return self.getByName(source)
            except:
                return self.add(_Source({"name":source}))

        if not isinstance(source, _Source):
            raise TypeError("Can only add a Source to Sources")

        try:
            return self.getByName(source.getName())
        except:
            pass

        id = source.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Source ID {source}")

            self.state["registry"][id] = source
        else:
            uid = _generate_source_uid()

            while uid in self.state["registry"]:
                uid = _generate_source_uid()

            source.state["id"] = uid
            self.state["registry"][uid] = source

        source._getHook = self._getHook
        self._names[source.getName()] = source.getID()
        return source

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except:
            raise KeyError(f"No Source with name {name}")

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Note with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                note = _Source.load(item)
                self.add(note)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        sources = Sources()
        source.state = value

        return sources
