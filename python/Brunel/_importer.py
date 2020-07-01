__all__ = [
    "getDefaultImporters",
    "extractPersonName",
    "isPerson",
    "importPerson",
    "isBusiness",
    "importBusiness",
    "importConnection",
    "importPositions",
    "importAffiliations",
    "importSources",
    "importType",
    "importNotes",
    "importProject",
    "importSource",
    "importBiography",
    "importEdgeSources",
    "importSharedLinks",
    "importProjectDates",
    "importWeights",
    "importEdgeCount",
]


def _clean_string(s):
    return str(s).lstrip().rstrip()


def _get_url(s):
    return _clean_string(s)


def _get_date(s):
    from ._daterange import Date as _Date

    return _Date(s)


def _get_daterange(s):
    parts = s.split(":")

    dates = []

    for part in parts:
        dates.append(_get_date(part))

    from ._daterange import DateRange as _DateRange

    if len(dates) == 0:
        return _DateRange.null()
    elif len(dates) == 1:
        return _DateRange(both=dates[0])
    elif len(dates) > 2:
        raise ValueError(f"Invalid number of dates? {dates}")
    else:
        return _DateRange(start=dates[0], end=dates[1])


def isPerson(node, importers=None):
    try:
        return str(node.Label).find("&") == -1
    except Exception:
        return False


def extractPersonName(name):
    name = name.lstrip().rstrip()
    orig_name = name

    titles = []
    firstnames = []
    surnames = []
    suffixes = []

    state = {}

    # some special cases
    if name == "Brunel, I.K.":
        firstnames.append("Isambard")
        firstnames.append("Kingdom")
        surnames.append("Brunel")
        state["gender"] = "male"
    elif name == "Wm Symonds":
        firstnames.append("W.")
        firstnames.append("M.")
        surnames.append("Symonds")
    elif name == "Mr John Edye":
        firstnames.append("John")
        surnames.append("Edye")
        titles.append("Mr.")
    else:
        name = name.replace("'", "")
        name = name.replace(".", " ")

        s = name.lower().find("(the elder)")

        if s != -1:
            suffixes.append("(the elder)")
            name = name[0:s]

        parts = name.split(",")

        possible_titles = {
            "captain": "Captain",
            "cpt": "Captain",
            "superintendent": "Superintendent",
            "dr": "Dr.",
            "doctor": "Dr.",
            "prof": "Prof.",
            "mr": "Mr.",
            "ms": "Ms.",
            "mrs": "Mrs.",
            "miss": "Miss.",
            "rn": "RN",
            "rev": "Rev.",
        }

        for part in parts[0].split(" "):
            for surname in part.split("."):
                try:
                    titles.append(possible_titles[surname.lower()])
                except KeyError:
                    if len(surname) > 0:
                        surnames.append(surname)

        try:
            for part in parts[1].split(" "):
                for firstname in part.split("."):
                    try:
                        titles.append(possible_titles[firstname.lower()])
                    except KeyError:
                        if len(firstname) == 1:
                            firstnames.append(f"{firstname}.")
                        elif len(firstname) > 1:
                            firstnames.append(firstname)
        except Exception:
            pass

    state["titles"] = titles
    state["firstnames"] = firstnames
    state["surnames"] = surnames
    state["suffixes"] = suffixes
    state["orig_name"] = orig_name

    if "Mr." in state["titles"]:
        state["gender"] = "male"
    elif (
        "Mrs." in state["titles"]
        or "Ms." in state["titles"]
        or "Miss." in state["titles"]
    ):
        state["gender"] = "female"

    return state


def importProjectDates(node, importers=None):
    from ._daterange import DateRange as _DateRange
    from ._daterange import Date as _Date
    import re as _re

    try:
        dates = str(node["Date (joined project: left project)"])
    except Exception:
        return _DateRange.null()

    if dates is None or dates == "0":
        return _DateRange.null()

    pattern = _re.compile(r":")
    raw = dates
    dates = pattern.split(dates)

    try:
        if len(dates) == 1:
            return _DateRange(both=_Date(dates[0]))
        elif len(dates) == 2:
            return _DateRange(start=_Date(dates[0]), end=_Date(dates[1]))
        else:
            print(f"Could not interpret project dates from {raw}")
            print(node)
            return _DateRange.null()
    except Exception:
        print(f"Could not interpret project dates from {raw}")
        print(node)
        return _DateRange.null()


def importPerson(node, project, importers=None):
    """ Create a person object from the passed node

        Args:
            node (pandas.Dataseries): Data from file
            project (Project): Project object this person is a part of
            importers (dict, default=None): Dictionary of importer functions
        Returns:
            Person: Person object populated with data from file
    """
    from ._person import Person as _Person

    try:
        extractPersonName = importers["extractPersonName"]
    except KeyError:
        extractPersonName = extractPersonName

    try:
        importPositions = importers["importPositions"]
    except KeyError:
        importPositions = importPositions

    try:
        importAffiliations = importers["importAffiliations"]
    except KeyError:
        importAffiliations = importAffiliations

    try:
        importSources = importers["importSources"]
    except KeyError:
        importSources = importSources

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        importProjectDates = importers["importProjectDates"]
    except KeyError:
        importProjectDates = importProjectDates

    pid = project.getID()

    try:
        name = str(node.Label)
        state = extractPersonName(name)

        state["positions"] = {pid: importPositions(node, importers=importers)}
        state["sources"] = {pid: importSources(node, importers=importers)}
        state["affiliations"] = {pid: importAffiliations(node, importers=importers)}
        state["notes"] = {pid: importNotes(node, importers=importers)}
        state["projects"] = {pid: importProjectDates(node, importers=importers)}
        state["weight"] = {pid: importWeights(node, importers=importers)}
        state["edge_count"] = {pid: importEdgeCount(node, importers=importers)}

        return _Person(state)
    except Exception as e:
        print(f"Cannot load Person\n{node}\nError = {e}\n")
        raise
        return None


def isBusiness(node, importers=None):
    return str(node.Label).find("&") != -1


def importBusiness(node, project, importers=None):
    try:
        importPositions = importers["importPositions"]
    except KeyError:
        importPositions = importPositions

    try:
        importAffiliations = importers["importAffiliations"]
    except KeyError:
        importAffiliations = importAffiliations

    try:
        importSources = importers["importSources"]
    except KeyError:
        importSources = importSources

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        importWeights = importers["importWeights"]
    except KeyError:
        importWeights = importWeights

    try:
        importEdgeCount = importers["importEdgeCount"]
    except KeyError:
        importEdgeCount = importEdgeCount

    from ._daterange import DateRange as _DateRange

    pid = project.getID()

    try:
        state = {}
        state["name"] = str(node.Label)
        state["positions"] = {pid: importPositions(node, importers=importers)}
        state["sources"] = {pid: importSources(node, importers=importers)}
        state["affiliations"] = {pid: importAffiliations(node, importers=importers)}
        state["notes"] = {pid: importNotes(node, importers=importers)}
        state["weight"] = {pid: importWeights(node, importers=importers)}
        state["positions"] = {pid: importPositions(node, importers=importers)}
        state["edge_count"] = {pid: importEdgeCount(node, importers=importers)}
        state["projects"] = {pid: _DateRange.null()}

        from ._business import Business as _Business

        return _Business(state)
    except Exception as e:
        print(f"Cannot load Business {node}: {e}")
        return None


def importSharedLinks(edge, importers=None):
    affiliations = importers["affiliations"]

    result = []

    import re as _re

    pattern = _re.compile(r":")

    for affiliation in pattern.split(str(edge["Shared Links"])):
        affiliation = extractAffiliationName(affiliation)
        affiliation = affiliations.add(affiliation)

        if affiliation:
            result.append(affiliation.getID())

    return result


def importEdgeSources(edge, importers=None):
    sources = importers["sources"]

    asources = {}
    csources = {}

    import re as _re
    from ._daterange import Date as _Date

    duration = _Date()

    pattern = _re.compile(r":")

    dates = pattern.split(str(edge["Dates of AS"]))

    adates = []

    for date in dates:
        date = _Date(date)
        adates.append(date)
        duration = duration.merge(date)

    dates = pattern.split(str(edge["Dates of CS"]))

    cdates = []

    for date in dates:
        date = _Date(date)
        cdates.append(date)
        duration = duration.merge(date)

    data = pattern.split(str(edge["Afiliation Sources (AS)"]))
    dates = adates

    while len(dates) < len(data):
        dates.append(duration)

    for i in range(0, len(data)):
        source = extractSourceName(data[i])
        date = _Date(dates[i])
        duration = duration.merge(date)

        source = sources.add(source)

        if source:
            if source.updateDate(date, force=True):
                sources.update(source)

            id = source.getID()

            if id not in asources:
                asources[id] = []

            asources[id].append(date)

    data = pattern.split(str(edge["Correspondence Sources (CS)"]))
    dates = adates

    while len(dates) < len(data):
        dates.append(duration)

    for i in range(0, len(data)):
        source = extractSourceName(data[i])
        date = _Date(dates[i])
        duration = duration.merge(date)

        source = sources.add(source)

        if source:
            if source.updateDate(date, force=True):
                sources.update(source)

            id = source.getID()

            if id not in csources:
                csources[id] = []

            csources[id].append(date)

    return (duration, asources, csources)


def importConnection(edge, project, mapping=None, importers=None):
    try:
        importEdgeSources = importers["importEdgeSources"]
    except KeyError:
        importEdgeSources = importEdgeSources

    try:
        importSharedLinks = importers["importSharedLinks"]
    except KeyError:
        importSharedLinks = importSharedLinks

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        importType = importers["importType"]
    except KeyError:
        importType = importType

    from ._daterange import DateRange as _DateRange

    try:
        if mapping:
            n0 = int(edge.Source)
            n1 = int(edge.Target)

            if n0 is None:
                raise KeyError(f"Unspecified n0 {n0} <=> {n1}")

            if n1 is None:
                raise KeyError(f"Unspecified n1 {n0} <=> {n1}")

            if n0 not in mapping:
                raise KeyError(f"No node0 with ID {n0}")

            if n1 not in mapping:
                raise KeyError(f"No node1 with ID {n1}")

            n0 = mapping[n0]
            n1 = mapping[n1]
        else:
            n0 = edge.Source
            n1 = edge.Target

        if n0 is None:
            raise KeyError(f"Unspecified n0 {n0} <=> {n1}")

        if n1 is None:
            raise KeyError(f"Unspecified n1 {n0} <=> {n1}")

        notes = importNotes(edge, importers=importers, isEdge=True)
        (duration, asources, csources) = importEdgeSources(edge, importers=importers)

        typ = importType(edge, importers=importers)
        shared_links = importSharedLinks(edge, importers=importers)

        from ._connection import Connection as _Connection

        return _Connection(
            {
                "n0": n0,
                "n1": n1,
                "notes": notes,
                "affiliations": asources,
                "correspondences": csources,
                "duration": duration,
                "shared": shared_links,
                "projects": {project.getID(): _DateRange.null()},
                "weights": {project.getID(): 1.0},
                "type": typ,
            }
        )

    except Exception as e:
        raise Exception(f"\nFailed to add connection!\n{e}\n{edge}\n\n")
        return None


def extractPositionName(position):
    position = position.lower().lstrip().rstrip()
    return position


def importPositions(node, importers=None):
    import re as _re

    positions = importers["positions"]

    result = []

    pattern = _re.compile(r":")

    for position in pattern.split(str(node["Position(s)"])):
        position = extractPositionName(position)
        position = positions.add(position)

        if position:
            result.append(position.getID())

    return result


def extractAffiliationName(affiliation):
    if not affiliation:
        return None

    affiliation = affiliation.lstrip().rstrip()

    lower = affiliation.lower()

    if lower == "nan" or affiliation == "_":
        return None

    return affiliation


def importAffiliations(node, importers=None):
    affiliations = importers["affiliations"]

    result = []

    import re as _re

    pattern = _re.compile(r":")

    for affiliation in pattern.split(str(node["Other Affiliations"])):
        affiliation = extractAffiliationName(affiliation)
        affiliation = affiliations.add(affiliation)

        if affiliation:
            result.append(affiliation.getID())

    return result


def extractSourceName(source):
    source = source.lstrip().rstrip()

    lower = source.lower()

    if lower == "nan" or lower == "_":
        return None

    return source


def importSources(node, importers=None):
    import re as _re

    sources = importers["sources"]
    result = []

    pattern = _re.compile(r":")

    for source in pattern.split(str(node["Source(s)"])):
        name = extractSourceName(source)
        source = sources.add(name)

        if source:
            result.append(source.getID())

    return result


def importWeights(node, importers=None):
    """ Import weights of each person from file

        Args:
            node (Pandas.Dataseries): Dataseries containing data
            importers (dict, default=None): Dictionary of importer functions
        Returns:
            int: Weight
    """
    return int(node["Weight"])


def importEdgeCount(node, importers=None):
    """ Import the edge counts of each person from file

        Args:
            node (Pandas.Dataseries): Dataseries containing data
            importers (dict, default=None): Dictionary of importer functions
        Returns:
            int: Number of edges
    """
    return int(node["Edge Tally"])


def importNotes(node, importers=None, isEdge=False):
    return []


def importType(edge, importers=None):
    """ Check the type of connection this edge represents

        Args:
            edge: Connection between nodes
            importers (dict, default=None): Importer functions
        Returns:
            str: Type of connection, direct or indirect
    """
    try:
        typ = str(edge.Link).lower()
    except Exception:
        return None

    if typ.find("indirect") != -1:
        return "indirect"
    elif typ.find("direct") != -1:
        return "direct"
    else:
        # print(f"Invalid link type? {typ}")
        return None


def importSource(data, importers=None):
    from ._source import Source as _Source

    props = {
        "name": _clean_string(data.Source),
        "description": _clean_string(data.Description),
    }

    return _Source(props)


def importProject(data, importers=None):
    from ._project import Project as _Project

    props = {
        "name": _clean_string(data.Name),
        "duration": _get_daterange(data.Duration),
        "url": _get_url(data.URL),
    }

    return _Project(props)


def importBiography(data, importers=None):
    name = str(data.Node).lstrip().rstrip()
    bio = str(data.Biography).lstrip().rstrip()

    if importers is None:
        return

    social = importers["social"]

    try:
        extractPersonName = importers["extractPersonName"]
    except KeyError:
        extractPersonName = extractPersonName

    from ._person import Person as _Person

    person = None

    try:
        person_name = extractPersonName(name)
        person = _Person(person_name)
        node = social.people().find(person.getName(), best_match=True)
        return (node, bio)
    except Exception:
        pass

    try:
        node = social.businesses().find(name)
        return (node, bio)
    except Exception:
        pass

    # let's try to find a person with the same surname...
    nodes = None

    try:
        nodes = social.people().find(person.getSurname())

        if isinstance(nodes, _Person):
            nodes = [nodes]

        for node in nodes:
            if node.couldBe(person):
                return (node, bio)
    except Exception:
        pass

    if nodes:
        print(f"Nearest matches are {nodes}")

    if name == "Humphries, Francis":
        data.Node = "Humphrys, Francis"
        return importBiography(data, importers)

    print(f"There is nothing called {name} for which to give a biography!")

    return (None, None)


def getDefaultImporters():
    return {
        "isPerson": isPerson,
        "extractPersonName": extractPersonName,
        "importPerson": importPerson,
        "isBusiness": isBusiness,
        "importBusiness": importBusiness,
        "importConnection": importConnection,
        "importPositions": importPositions,
        "importAffiliations": importAffiliations,
        "importSources": importSources,
        "importNotes": importNotes,
        "importType": importType,
        "importSource": importSource,
        "importProject": importProject,
        "importBiography": importBiography,
        "importEdgeSources": importEdgeSources,
        "importSharedLinks": importSharedLinks,
        "importProjectDates": importProjectDates,
        "importWeights": importWeights,
        "importEdgeCount": importEdgeCount,
    }

