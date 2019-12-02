

def test_load():
    import Brunel
    social = Brunel.Social.load_from_csv("input/nodes.csv", "input/edges.csv")

    json = Brunel.stringify(social)

    with open("test.json", "w") as FILE:
        FILE.write(json)

    assert False
