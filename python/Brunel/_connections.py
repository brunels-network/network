
import uuid as _uuid
from ._connection import Connection as _Connection

__all__ = ["Connections"]


def _generate_connection_uid():
    uid = _uuid.uuid4()
    return "C" + str(uid)[:7]


class Connections:
    """This holds a registry of individual Connections"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, connection: _Connection):
        if connection is None:
            return

        if isinstance(connection, str):
            # try to find an existing connection with this name
            try:
                return self.getByName(connection)
            except Exception:
                return self.add(_Connection({"name": connection}))

        if not isinstance(connection, _Connection):
            raise TypeError("Can only add a Connection to Connections")

        existing = None

        try:
            existing = self.getByName(connection.getName())
        except Exception:
            pass

        if existing:
            existing = existing.merge(connection)
            self.state["registry"][existing.getID()] = existing
            return existing

        id = connection.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Connection ID {connection}")

            self.state["registry"][id] = connection
        else:
            uid = _generate_connection_uid()

            while uid in self.state["registry"]:
                uid = _generate_connection_uid()

            connection.state["id"] = uid
            self.state["registry"][uid] = connection

        connection._getHook = self._getHook
        self._names[connection.getName()] = connection.getID()
        return connection

    def get(self, id):
        try:
            return self.state["registry"][id]
        except KeyError:
            raise KeyError(f"No Message with ID {id}")

    def find(self, node0, node1):
        return self.getByName(_Connection.getConnectionName(node0, node1))

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Connection with name {name}")

    def getByNodes(self, n0, n1):
        try:
            n0 = n0.getID()
        except Exception:
            pass

        try:
            n1 = n1.getID()
        except Exception:
            pass

        if n0 <= n1:
            return self.getByName(f"{n0}<=>{n1}")
        else:
            return self.getByName(f"{n1}<=>{n0}")

    def values(self):
        return self.state["registry"].values()

    def load(self, data):
        if data:
            for item in data:
                connection = _Connection.load(item)
                self.add(connection)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        connections = Connections()
        connections.state = value
        return connections
