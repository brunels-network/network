
__all__ = ["load_images"]


def load_images(filename, sheet_name, social, image_dir, image_root="images"):
    import pandas as pd
    import os
    data = pd.read_excel(filename, sheet_name=sheet_name)

    filenames = data["Filename"]
    credit_lines = data["Credit Line"]

    images = {}

    for i, filename in enumerate(filenames):
        fullpath = f"{image_dir}/{image_root}/{filename}"

        if not os.path.exists(fullpath):
            print(f"CANNOT FIND FILE {fullpath} - check and try again!")
            continue

        part = filename.split("/")

        name = part[1].replace("_", " ")
        name = name.split(".")[0]

        if part[0].lower() == "ships":
            # projects
            ID = social.projects().find(name).getID()
        elif part[0].lower() == "people":
            ID = social.people().find(name).getID()
        else:
            print(f"Cannot identify the type for {filename}")

        if not pd.isnull(credit_lines[i]):
            credit = credit_lines[i]
        else:
            credit = None

        images[ID] = [f"{image_root}/{filename}", credit]

    return images
