
from ._people import People as _People
from ._person import Person as _Person
from ._message import Message as _Message
from ._messages import Messages as _Messages

__all__ = ["Social"]


def _isPerson(node):
    return str(node.Label).find("&") == -1


def _loadPerson(node):
    name = str(node.Label)
    positions = str(node.Position).lower().split(",")
    sources = [str(node.Source)]
    affiliations = str(node.Affiliations).split(",")

    return _Person({"name": name,
                    "positions": positions,
                    "sources": sources,
                    "affiliations": affiliations})


def _isBusiness(node):
    return False


def _loadBusiness(node):
    return None


def _loadMessage(edge, mapping):
    try:
        sender = mapping[int(edge.Source)]
        receiver = mapping[int(edge.Target)]
    except:
        print(f"Cannot map {edge}")
        return None

    return _Message({"sender": sender,
                     "receiver": receiver,
                     "notes": [str(edge.Link)],
                     "sources": [str(edge.Archive)],
                    })


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        self.state = {
            "people": _People(),
            "messages": _Messages(),
        }

    def get(self, id):
        if id.startswith("M"):
            return self.state["messages"].get(id)
        elif id.startswith("P"):
            return self.state["people"].get(id)
        else:
            return id

    @staticmethod
    def load_from_csv(nodes, edges,
                      isPerson=_isPerson, loadPerson=_loadPerson,
                      isBusiness=_isBusiness, loadBusiness=_loadBusiness,
                      loadMessage=_loadMessage):
        import pandas as _pd
        nodes = _pd.read_csv(nodes)
        edges = _pd.read_csv(edges)

        ids = {}

        social = Social()
        people = _People()
        messages = _Messages()

        people._social = social
        messages._social = social

        for _, node in nodes.iterrows():
            if isPerson(node):
                person = loadPerson(node)
                if person:
                    people.add(person)
                    ids[node.ID] = person.getID()
            elif isBusiness(node):
                business = loadBusiness(node)
                if business:
                    businesses.add(business)
                    ids[node.ID] = business.getID()

        for _, edge in edges.iterrows():
            message = loadMessage(edge, ids)
            if message:
                messages.add(message)

        social.state["people"] = people
        social.state["messages"] = messages

        return social

