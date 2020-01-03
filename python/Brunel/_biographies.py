
class Biographies:
    def __init__(self, getHook=None):
        self._getHook = getHook

        self.state = {
            "bios": {}
        }

    def get(self, node):
        try:
            node = node.getID()
        except Exception:
            pass

        if node in self.state["bios"]:
            return self.state["bios"]
        else:
            return None

    def getNode(self, id):
        if self._getHook:
            return self._getHook(id)
        else:
            return id

    def add(self, node, biography):
        try:
            node = node.getID()
        except Exception:
            pass

        if node is None or biography is None:
            return

        if node in self.state["bios"]:
            print(f"There is already a biography for {self.getNode(node)}")
            biography = f"{self.state['bios'][node]}\n{biography}"

        self.state["bios"][node] = biography

    def toDry(self):
        return self.state

    @staticmethod
    def unDry(value):
        biographies = Biographies()
        biographies.state = value
        return biographies
