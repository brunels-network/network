
from ._position import Position as _Position

__all__ = ["Positions"]


def _generate_position_uid():
    import uuid as _uuid
    uid = _uuid.uuid4()
    return "Q" + str(uid)[:7]


class Positions:
    """This holds a registry of individual Positions"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self._names = {}

        self.load(props)

    def add(self, position: _Position):
        if position is None:
            return

        if isinstance(position, str):
            # try to find an existing position with this name
            try:
                return self.getByName(position)
            except Exception:
                return self.add(_Position({"name": position}))

        if not isinstance(position, _Position):
            raise TypeError("Can only add a Position to Positions")

        try:
            return self.getByName(position.getName())
        except Exception:
            pass

        id = position.getID()

        if id:
            if id in self.state["registry"]:
                raise KeyError(f"Duplicate Position ID {position}")

            self.state["registry"][id] = position
        else:
            uid = _generate_position_uid()

            while uid in self.state["registry"]:
                uid = _generate_position_uid()

            position.state["id"] = uid
            self.state["registry"][uid] = position

        self._names[position.getName()] = position.getID()
        position._getHook = self._getHook
        return position

    def getByName(self, name):
        try:
            return self.get(self._names[name])
        except Exception:
            raise KeyError(f"No Position with name {name}")

    def find(self, value):
        value = value.lstrip().rstrip().lower()

        results = []

        for name in self._names.keys():
            if name.lower().find(value) != -1:
                results.append(self.get(self._names[name]))

        if len(results) == 1:
            return results[0]
        elif len(results) == 0:
            return None
        else:
            return results

    def get(self, id):
        try:
            return self.state["registry"][id]
        except Exception:
            raise KeyError(f"No Position with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                position = _Position.load(item)
                self.add(position)

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        positions = Positions()
        positions.state = value

        positions._names = {}

        for position in positions.state["registry"].values():
            positions._names[position.getName()] = position.getID()

        return positions
