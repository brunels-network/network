
__all__ = ["getDefaultImporters", "extractPersonName",
           "isPerson", "importPerson", "isBusiness", "importBusiness",
           "importMessage", "importPositions", "importAffiliations",
           "importSources", "importScores", "importNotes"]


def isPerson(node, importers=None):
    try:
        return str(node.Label).find("&") == -1
    except Exception:
        return False


def extractPersonName(name):
    name = name.lstrip().rstrip()

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

        possible_titles = {"captain": "Captain",
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
                           "rev": "Rev."
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

    if "Mr." in state["titles"]:
        state["gender"] = "male"
    elif "Mrs." in state["titles"] or "Ms." in state["titles"] or \
         "Miss." in state["titles"]:
        state["gender"] = "female"

    return state


def importPerson(node, importers=None):
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
        importScores = importers["importScores"]
    except KeyError:
        importScores = importScores

    try:
        importSources = importers["importSources"]
    except KeyError:
        importSources = importSources

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        name = str(node.Label)
        state = extractPersonName(name)
        state["positions"] = importPositions(node, importers=importers)
        state["sources"] = importSources(node, importers=importers)
        state["affiliations"] = importAffiliations(node, importers=importers)
        state["notes"] = importNotes(node, importers=importers)
        state["scores"] = importScores(node, importers=importers)

        from ._person import Person as _Person
        return _Person(state)
    except Exception as e:
        print(f"Cannot load Person {node}: {e}")
        return None


def isBusiness(node, importers=None):
    return str(node.Label).find("&") != -1


def importBusiness(node, importers=None):
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
        importScores = importers["importScores"]
    except KeyError:
        importScores = importScores

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        name = str(node.Label)
        positions = importPositions(node, importers=importers)
        sources = importSources(node, importers=importers)
        affiliations = importAffiliations(node, importers=importers)
        notes = importNotes(node, importers=importers)
        scores = importScores(node, importers=importers)

        from ._business import Business as _Business
        return _Business({"name": name,
                          "positions": positions,
                          "sources": sources,
                          "affiliations": affiliations,
                          "scores": scores,
                          "notes": notes})
    except Exception as e:
        print(f"Cannot load Business {node}: {e}")
        return None


def importMessage(edge, mapping=None, importers=None):
    try:
        importSources = importers["importSources"]
    except KeyError:
        importSources = importSources

    try:
        importNotes = importers["importNotes"]
    except KeyError:
        importNotes = importNotes

    try:
        importScores = importers["importScores"]
    except KeyError:
        importScores = importScores

    try:
        if mapping:
            sender = mapping[int(edge.Source)]
            receiver = mapping[int(edge.Target)]
        else:
            sender = edge.Source
            receiver = edge.Target

        notes = importNotes(edge, importers=importers, isEdge=True)
        sources = importSources(edge, importers=importers, isEdge=True)
        scores = importScores(edge, importers=importers, isEdge=True)

        from ._message import Message as _Message
        return _Message({"sender": sender,
                         "receiver": receiver,
                         "notes": notes,
                         "sources": sources,
                         "scores": scores,
                         })

    except Exception as e:
        print(f"Cannot map {edge}: {e}")
        return None


def extractPositionName(position):
    position = position.lower().lstrip().rstrip()
    return position


def importPositions(node, importers=None):
    positions = importers["positions"]

    result = {}

    from ._daterange import DateRange as _DateRange

    for part in str(node.Position).split(","):
        for position in part.split(";"):
            position = extractPositionName(position)
            position = positions.add(position)

            if position:
                result[position.getID()] = _DateRange.null()

    return result


def extractAffiliationName(affiliation):
    affiliation = affiliation.lstrip().rstrip()

    lower = affiliation.lower()

    if lower == "nan" or affiliation == "_":
        return None

    return affiliation


def importAffiliations(node, importers=None):
    affiliations = importers["affiliations"]

    result = {}

    from ._daterange import DateRange as _DateRange

    for parts in str(node.Affiliations).split(","):
        for affiliation in parts.split(";"):
            affiliation = extractAffiliationName(affiliation)
            affiliation = affiliations.add(affiliation)

            if affiliation:
                result[affiliation.getID()] = _DateRange.null()

    return result


def importSources(node, importers=None, isEdge=False):
    sources = importers["sources"]

    source = sources.add(str(node.Source).lstrip().rstrip())

    if source:
        return [source.getID()]
    else:
        return []


def importNotes(node, importers=None, isEdge=False):
    return []


def importScores(node, importers=None, isEdge=False):
    scores = {}

    if isEdge:
        try:
            score = str(node.Type).lower()
            possible = {"direct": 5, "dirct": 5, "cirect": 5,
                        "strong": 10, "indirect": 3, "weak": 1}

            scores["weight"] = possible[score]
        except Exception:
            pass
    else:
        try:
            scores["weight"] = int(node.WEIGHT)
        except Exception:
            pass

    return scores


def getDefaultImporters():
    return {"isPerson": isPerson, "extractPersonName": extractPersonName,
            "importPerson": importPerson,
            "isBusiness": isBusiness, "importBusiness": importBusiness,
            "importMessage": importMessage, "importPositions": importPositions,
            "importAffiliations": importAffiliations,
            "importSources": importSources, "importNotes": importNotes,
            "importScores": importScores}
