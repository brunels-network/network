
__all__ = ["Social"]


def _read_data(data):
    import pandas as _pd

    sep = ","

    if data.endswith(".tsv"):
        sep = "\t"

    return _pd.read_csv(data, sep=sep)


def _get_importers(importers):
    from ._importer import getDefaultImporters as _getDefaultImporters
    defaults = _getDefaultImporters()

    if importers is None:
        importers = defaults
    else:
        for key in importers.keys():
            if key not in importers:
                importers[key] = defaults[key]

    return importers


def _get_modifiers(modifiers, name=None):
    if modifiers is None:
        modifiers = {}
    elif name is not None:
        modifiers = {name: modifiers}

    for key in ["person", "business", "connection", "project",
                "source", "biography"]:
        if key not in modifiers:
            modifiers[key] = lambda item: item

    return modifiers


class Social:
    """This class holds a complete social network"""
    def __init__(self):
        from ._people import People as _People
        from ._connections import Connections as _Connections
        from ._businesses import Businesses as _Businesses
        from ._positions import Positions as _Positions
        from ._affiliations import Affiliations as _Affiliations
        from ._sources import Sources as _Sources
        from ._projects import Projects as _Projects
        from ._notes import Notes as _Notes
        from ._biographies import Biographies as _Biographies

        self.state = {
            "people": _People(getHook=self.get),
            "connections": _Connections(getHook=self.get),
            "businesses": _Businesses(getHook=self.get),
            "positions": _Positions(getHook=self.get),
            "affiliations": _Affiliations(getHook=self.get),
            "sources": _Sources(getHook=self.get),
            "projects": _Projects(getHook=self.get),
            "notes": _Notes(getHook=self.get),
            "biographies": _Biographies(getHook=self.get),
        }

    def people(self):
        return self.state["people"]

    def connections(self):
        return self.state["connections"]

    def businesses(self):
        return self.state["businesses"]

    def positions(self):
        return self.state["positions"]

    def affiliations(self):
        return self.state["affiliations"]

    def sources(self):
        return self.state["sources"]

    def projects(self):
        return self.state["projects"]

    def notes(self):
        return self.state["notes"]

    def biographies(self):
        return self.state["biographies"]

    def get(self, id):
        if id.startswith("C"):
            return self.connections().get(id)
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

    def load_projects(self, projects, importers=None, modifiers=None):
        data = _read_data(projects)

        importers = _get_importers(importers)
        modifiers = _get_modifiers(modifiers, "project")

        projects = self.projects()

        for _, project in data.iterrows():
            project = importers["importProject"](project, importers=importers)
            if project:
                project = modifiers["project"](project)
                projects.add(project)

    def load_sources(self, sources, importers=None, modifiers=None):
        data = _read_data(sources)

        importers = _get_importers(importers)
        modifiers = _get_modifiers(modifiers, "source")

        sources = self.sources()

        for _, source in data.iterrows():
            source = importers["importSource"](source, importers=importers)
            if source:
                source = modifiers["source"](source)
                sources.add(source)

    def load_biographies(self, bios, importers=None, modifiers=None):
        bios = _read_data(bios)

        importers = _get_importers(importers)
        importers["social"] = self
        modifiers = _get_modifiers(modifiers, "biography")

        biographies = self.biographies()

        for _, bio in bios.iterrows():
            node, biography = importers["importBiography"](bio,
                                                           importers=importers)

            if biography:
                biography = modifiers["biography"](biography)
                biographies.add(node, biography)

    def load_graph(self, project, nodes, edges,
                   importers=None, modifiers=None):
        project = self.projects().find(project)

        nodes = _read_data(nodes)
        edges = _read_data(edges)

        importers = _get_importers(importers)
        modifiers = _get_modifiers(modifiers)

        ids = {}

        people = self.people()
        connections = self.connections()
        businesses = self.businesses()

        importers["positions"] = self.positions()
        importers["affiliations"] = self.affiliations()
        importers["sources"] = self.sources()
        importers["notes"] = self.notes()

        for _, node in nodes.iterrows():
            if importers["isPerson"](node, importers=importers):
                person = importers["importPerson"](node, project,
                                                   importers=importers)
                if person:
                    person = modifiers["person"](person)
                    people.add(person)
                    ids[node.ID] = person.getID()
            elif importers["isBusiness"](node, importers=importers):
                business = importers["importBusiness"](node, project,
                                                       importers=importers)
                if business:
                    business = modifiers["business"](business)
                    businesses.add(business)
                    ids[node.ID] = business.getID()

        for _, edge in edges.iterrows():
            connection = importers["importConnection"](edge, project,
                                                       mapping=ids,
                                                       importers=importers)
            if connection:
                print(connection)
                connection = modifiers["connection"](connection)
                connections.add(connection)

    def toDry(self):
        return self.state
