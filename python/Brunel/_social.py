
__all__ = ["Social"]

import collections
import json


def _read_data(data_filepath, sheet_name=0):
    """ Read data from file
        Args:
            data (str): Filepath for data file
        Returns:
            pandas.DataFrame
    """
    import pandas as _pd

    if data_filepath.endswith(".xlsx"):
        return _pd.read_excel(data_filepath, sheet_name=sheet_name)

    sep = ","

    if data_filepath.endswith(".tsv"):
        sep = "\t"

    return _pd.read_csv(data_filepath, sep=sep)


def _get_importers(importers):
    """ Get importing functions for each process

        Args:
            importers (function): Functon allowing import of data
        Returns:
            dict: Dictionary of importer functions
    """
    from ._importer import getDefaultImporters as _getDefaultImporters

    defaults = _getDefaultImporters()

    if importers is None:
        importers = defaults
    else:
        for key in importers.keys():
            if key not in importers:
                print(f"We have no importer for {key}")
                importers[key] = defaults[key]

    return importers


def _get_modifiers(modifiers, name=None):
    """ Get modifier functions for each type

        Args:
            modifiers (dict): Dictionary of modifier functions
            name (str): Name of type
        Return:
            dict: Dictionary of modifier functions
    """
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

    def load_projects(self, projects_filepath, importers=None, modifiers=None,
                      sheet_name=0):
        """ Load in projects from file

            Args:
                projects_filepath (str): Path to file holding sources
                importers (dict, default=None): Dictionary of importer functions
                modifiers (dict, default=None): Dictionary of modifier functions
            Returns:
                None
        """
        data = _read_data(projects_filepath, sheet_name=sheet_name)

        importers = _get_importers(importers)
        modifiers = _get_modifiers(modifiers, "project")

        projects = self.projects()

        for _, project in data.iterrows():
            # Get the import function
            import_project = importers["importProject"]

            project = import_project(project, importers=importers)

            if project:
                project = modifiers["project"](project)
                projects.add(project)

    def load_sources(self, sources_filepath, importers=None, modifiers=None,
                     sheet_name=0):
        """ Load in sources from file

            Args:
                sources_filepath (str): Path to file holding sources
                importers (dict, default=None): Dictionary of importer functions
                modifiers (dict, default=None): Dictionary of modifier functions
            Returns:
                None
        """
        data = _read_data(sources_filepath, sheet_name=sheet_name)

        # Get the importer and modifier functions
        importers = _get_importers(importers)
        modifiers = _get_modifiers(modifiers, "source")

        sources = self.sources()

        # Get the function from the dictionary
        import_source = importers["importSource"]

        for _, source in data.iterrows():
            source = import_source(source, importers=importers)
            if source:
                source = modifiers["source"](source)
                sources.add(source)

    def load_biographies(self, bios_filepath, importers=None, modifiers=None,
                         sheet_name=0):
        """ Load in biographies from file

            Args:
                bios_filepath (str): Path to file holding bios
                importers (dict, default=None): Dictionary of importer functions
                modifiers (dict, default=None): Dictionary of modifier functions
            Returns:
                None
        """
        bios = _read_data(bios_filepath, sheet_name=sheet_name)

        importers = _get_importers(importers)
        importers["social"] = self
        modifiers = _get_modifiers(modifiers, "biography")

        biographies = self.biographies()
        import_bio = importers["importBiography"]

        for _, bio in bios.iterrows():
            node, biography = import_bio(bio, importers=importers)

            if biography:
                biography = modifiers["biography"](biography)
                biographies.add(node, biography)

    def load_graph(self, project, nodes_filepath, edges_filepath,
                   importers=None, modifiers=None,
                   nodes_sheet_name=0, edges_sheet_name=0):
        """ Load graph data in from file

            Args:
                project (str): Name of project
                nodes_filepath (str): Path of nodes data file
                edges_filepath (str): Path of edges data file
                importers (dict, default=None): Dictionary of importer functions
                modifiers (dict, default=None): Dictionary of modifier functions
            Returns:
                None
        """
        project = self.projects().find(project)

        # Load in the saved UIDs for items
        # uid_file = "data/fixed_uids.json"
        # with open(uid_file, "r") as f:
        #     uid_records = json.load(f)

        # uid_records = collections.defaultdict(dict)

        # Read in the data from file
        nodes = _read_data(nodes_filepath, sheet_name=nodes_sheet_name)
        edges = _read_data(edges_filepath, sheet_name=edges_sheet_name)

        # Get the importer and modifier functions
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

        # Assign the functions from the importer dictionary
        # for easier reading
        is_person = importers["isPerson"]
        is_business = importers["isBusiness"]
        import_person = importers["importPerson"]
        import_business = importers["importBusiness"]
        import_connection = importers["importConnection"]

        # Loop over the Pandas Dataframe to create nodes
        for _, node in nodes.iterrows():
            if is_person(node, importers=importers):
                person = import_person(node, project, importers=importers)

                if person:
                    # Use the function from the modifiers dict to process this person
                    person = modifiers["person"](person)
                    person = people.add(person)
                    ids[node.ID] = person.getID()
            elif is_business(node, importers=importers):
                business = import_business(node, project, importers=importers)

                if business:
                    business = modifiers["business"](business)
                    business = businesses.add(business)
                    ids[node.ID] = business.getID()

        # Look over dataframe to import connections between nodes
        for _, edge in edges.iterrows():
            connection = import_connection(edge, project, mapping=ids, importers=importers)

            if connection:
                connection = modifiers["connection"](connection)
                connections.add(connection)

    def toDry(self):
        """ Return the state of this object

            Returns:
                dict: Dictionary of state ready for "drying"
        """
        return self.state
