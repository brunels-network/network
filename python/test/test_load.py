
import Brunel


def test_load():
    social = Brunel.Social.load_from_csv("input/nodes.csv", "input/edges.csv")

    p = social.state["messages"]

    for message in p.state["registry"].values():
        print(message)

    raise TypeError()
