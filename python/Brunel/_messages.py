
import uuid as _uuid
from ._message import Message as _Message

__all__ = ["Messages"]


def _generate_message_uid():
  uid =_uuid.uuid4()
  return "M" + str(uid)[:7]


class Messages:
    """This holds a registry of individual Messages"""
    def __init__(self, props=None):
        self._social = None

        self.state = {
            "registry": {},
        }

        self.load(props)

    def add(self, message: _Message):
        if message is None:
            return

        if not isinstance(message, _Message):
            raise TypeError("Can only add a Message to Messages")

        id = message.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Message ID {message}")

            self.state["registry"][id] = message
        else:
            uid = _generate_message_uid()

            while uid in self.state["registry"]:
                uid = _generate_message_uid()

            message.state["id"] = uid
            self.state["registry"][uid] = message

        message._social = self._social

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Message with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                message = _Message.load(item)
                self.add(message)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        messages = Messages()
        messages.state = value
        return messages
