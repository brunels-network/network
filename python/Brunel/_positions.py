
from ._position import Position as _Position

__all__ = ["Positions"]


def _generate_position_uid():
    import uuid as _uuid
    uid =_uuid.uuid4()
    return "Q" + str(uid)[:7]


class Positions:
    """This holds a registry of individual Positions"""
    def __init__(self, props=None, getHook=None):
        self._getHook = getHook

        self.state = {
            "registry": {},
        }

        self.load(props)

    def add(self, position: _Position):
        if position is None:
            return

        if not isinstance(position, _Position):
            raise TypeError("Can only add a Position to Positions")

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

        position._getHook = self._getHook

    def get(self, id):
        try:
            return self.state["registry"][id]
        except:
            raise KeyError(f"No Position with ID {id}")

    def load(self, data):
        if data:
            for item in data:
                position = _Position.load(item)
                self.add(position)

    def toDry(self):
        return {"value": self.state}

    @staticmethod
    def unDry(value):
        positions = Positions()
        positions.state = value
        return positions
