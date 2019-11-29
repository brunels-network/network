
from ._people import People as _People
from ._person import Person as _Person
from ._message import Message as _Message
from ._messages import Messages as _Messages

__all__ = ["Social"]


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        self.state = {
            "people": _People(),
            "messages": _Messages(),
        }

    @staticmethod
    def load_from_csv(nodes, edges):
        import pandas as _pd;
        nodes = _pd.read_csv(nodes)
        edges = _pd.read_csv(edges)

        ids = {}

        people = _People()
        messages = _Messages()

        for _, node in nodes.iterrows():
            person = _Person.load_from_csv(node)
            people.add(person)
            ids[node.ID] = person.getID()

        for _, edge in edges.iterrows():
            message = _Message.load_from_csv(edge, ids)
            messages.add(message)

        social = Social()
        social.state["people"] = people
        social.state["messages"] = messages

        return social

