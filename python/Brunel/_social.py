
__all__ = ["Social"]


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        from ._people import People as _People
        from ._messages import Messages as _Messages
        from ._businesses import Businesses as _Businesses

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
    def load_from_csv(nodes, edges, importers=None):
        import pandas as _pd
        nodes = _pd.read_csv(nodes)
        edges = _pd.read_csv(edges)

        from ._importer import getDefaultImporters as _getDefaultImporters
        defaults = _getDefaultImporters()

        if importers is None:
            importers = defaults
        else:
            for key in importers.keys():
                if key not in importers:
                    importers[key] = defaults[key]

        ids = {}

        social = Social()
        people = social.people()
        messages = social.messages()
        businesses = social.businesses()

        for _, node in nodes.iterrows():
            if importers["isPerson"](node, importers=importers):
                person = importers["importPerson"](node, importers=importers)
                if person:
                    people.add(person)
                    ids[node.ID] = person.getID()
            elif importers["isBusiness"](node, importers=importers):
                business = importers["importBusiness"](node,
                                                       importers=importers)
                if business:
                    businesses.add(business)
                    ids[node.ID] = business.getID()

        for _, edge in edges.iterrows():
            message = importers["importMessage"](edge, mapping=ids,
                                                 importers=importers)
            if message:
                messages.add(message)

        return social
