
from ._people import People as _People
from ._person import Person as _Person
from ._message import Message as _Message
from ._messages import Messages as _Messages
from ._business import Business as _Business
from ._businesses import Businesses as _Businesses

__all__ = ["Social"]


def _isPerson(node):
    return str(node.Label).find("&") == -1


def _loadPerson(node):
    try:
        name = str(node.Label)
        positions = str(node.Position).lower().split(",")
        sources = [str(node.Source)]
        affiliations = str(node.Affiliations).split(",")

        return _Person({"name": name,
                        "positions": positions,
                        "sources": sources,
                        "affiliations": affiliations})
    except Exception as e:
        print(f"Cannot load Person {node}: {e}")
        return None


def _isBusiness(node):
    return str(node.Label).find("&") != -1


def _loadBusiness(node):
    try:
        name = str(node.Label)
        positions = str(node.Position).lower().split(",")
        sources = [str(node.Source)]
        affiliations = str(node.Affiliations).split(",")

        return _Business({"name": name,
                          "positions": positions,
                          "sources": sources,
                          "affiliations": affiliations})
    except Exception as e:
        print(f"Cannot load Business {node}: {e}")
        return None


def _loadMessage(edge, mapping):
    try:
        sender = mapping[int(edge.Source)]
        receiver = mapping[int(edge.Target)]
        return _Message({"sender": sender,
                        "receiver": receiver,
                        "notes": [str(edge.Link)],
                        "sources": [str(edge.Archive)],
                        })

    except Exception as e:
        print(f"Cannot map {edge}: {e}")
        return None


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        self.state = {
            "people": _People(getHook=self.get),
            "messages": _Messages(getHook=self.get),
            "businesses": _Businesses(getHook=self.get),
        }

    def people(self):
        return self.state["people"]

    def messages(self):
        return self.state["messages"]

    def businesses(self):
        return self.state["businesses"]

    def get(self, id):
        if id.startswith("M"):
            return self.messages().get(id)
        elif id.startswith("P"):
            return self.people().get(id)
        elif id.startswith("B"):
            return self.businesses().get(id)
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
        people = social.people()
        messages = social.messages()
        businesses = social.businesses()

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

        return social

