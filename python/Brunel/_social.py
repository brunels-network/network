
__all__ = ["Social"]


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        from ._people import People as _People
        from ._messages import Messages as _Messages
        from ._businesses import Businesses as _Businesses
        from ._positions import Positions as _Positions
        from ._affiliations import Affiliations as _Affiliations
        from ._sources import Sources as _Sources
        from ._notes import Notes as _Notes

        self.state = {
            "people": _People(getHook=self.get),
            "messages": _Messages(getHook=self.get),
            "businesses": _Businesses(getHook=self.get),
            "positions" : _Positions(getHook=self.get),
            "affiliations": _Affiliations(getHook=self.get),
            "sources": _Sources(getHook=self.get),
            "notes": _Notes(getHook=self.get),
        }

    def people(self):
        return self.state["people"]

    def messages(self):
        return self.state["messages"]

    def businesses(self):
        return self.state["businesses"]

    def positions(self):
        return self.state["positions"]

    def affiliations(self):
        return self.state["affiliations"]

    def sources(self):
        return self.state["sources"]

    def notes(self):
        return self.state["notes"]

    def get(self, id):
        if id.startswith("M"):
            return self.messages().get(id)
        elif id.startswith("P"):
            return self.people().get(id)
        elif id.startswith("B"):
            return self.businesses().get(id)
        elif id.startswith("Q"):
            return self.positions().get(id)
        elif id.startswith("A"):
            return self.affiliations().get(id)
        elif id.startswith("S"):
            return self.sources().get(id)
        elif id.startswith("N"):
            return self.notes().get(id)
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

        importers["positions"] = social.positions()
        importers["affiliations"] = social.affiliations()
        importers["sources"] = social.sources()
        importers["notes"] = social.notes()

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

    def toDry(self):
        return self.state
