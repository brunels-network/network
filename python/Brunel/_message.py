
__all__ = ["Message"]


def _setState(state, val, default=None):
    try:
        result = state[val]
        if result:
            return result
        else:
            return default
    except KeyError:
        return default


class Message:
    """Holds information about a Message in the network"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "name": None,
            "id": None,
            "sender": None,
            "receiver": None,
            "scores": {},
            "sources": [],
            "notes": [],
        }

        self.setState(props)

    def __str__(self):
        sender = self.getSender()
        receiver = self.getReceiver()

        if sender is None or receiver is None:
            return "Message::null"
        else:
            return f"Message({self.getSenderName()} " \
                   f"=> {self.getReceiverName()})"

    def __repr__(self):
        return self.__str__()

    def getSenderName(self):
        sender = self.getSender()

        try:
            return sender.getName()
        except Exception:
            return sender

    def getReceiverName(self):
        receiver = self.getReceiver()

        try:
            return receiver.getName()
        except Exception:
            return receiver

    def getSender(self):
        sender = self.state["sender"]

        if self._getHook:
            sender = self._getHook(sender)

        return sender

    def getReceiver(self):
        receiver = self.state["receiver"]

        if self._getHook:
            receiver = self._getHook(receiver)

        return receiver

    def getID(self):
        return self.state["id"]

    def setState(self, state):
        if not state:
            return

        self.state["name"] = _setState(state, "name")
        self.state["id"] = _setState(state, "id")
        self.state["sender"] = _setState(state, "sender")
        self.state["receiver"] = _setState(state, "receiver")
        self.state["sources"] = _setState(state, "sources", [])
        self.state["scores"] = _setState(state, "scores", {})
        self.state["notes"] = _setState(state, "notes", [])

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        return Message(value)

    @staticmethod
    def load(data):
        return Message(data)
