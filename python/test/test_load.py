
import Brunel


def test_load():
    social = Brunel.Social.load_from_csv("input/nodes.csv", "input/edges.csv")

    for person in social.people().values():
        print(person, person.getPositions(), person.getAffiliations())

    for business in social.businesses().values():
        print(business, business.getAffiliations())

    raise TypeError()
