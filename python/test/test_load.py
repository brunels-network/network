

def test_load():
    import Brunel
    social = Brunel.Social.load_from_csv("input/nodes.csv", "input/edges.csv")

    json = Brunel.stringify(social)

    print(json)

    assert False
