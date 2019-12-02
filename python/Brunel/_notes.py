
from ._note import Note as _Note

__all__ = ["Notes"]


def _generate_note_uid():
    import uuid as _uuid
    uid =_uuid.uuid4()
    return "N" + str(uid)[:7]


class Notes:
    """This holds a registry of individual Notes"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self.load(props)

    def add(self, note: _Note):
        if note is None:
            return

        if not isinstance(note, _Note):
            raise TypeError("Can only add a Note to a Notes")

        id = note.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Note ID {note}")

            self.state["registry"][id] = note
        else:
            uid = _generate_note_uid()

            while uid in self.state["registry"]:
                uid = _generate_note_uid()

            note.state["id"] = uid
            self.state["registry"][uid] = note

        note._getHook = self._getHook
        return note

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Note with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                note = _Note.load(item)
                self.add(note)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        notes = Notes()
        notes.state = value

        return notes
