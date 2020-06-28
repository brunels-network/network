from datetime import datetime
import json
from pathlib import Path
import shutil

from ._dry import stringify


def check_and_backup(filepath):
    """ Checks if a file exists at filepath and creates a timestamped backup of the file

        Args:
            filepath (str, pathlib.Path): Path to file
        Returns:
            pathlib.Path: Filepath
    """
    filepath = Path(filepath)

    if filepath.exists():
        filename = filepath.stem
        extension = filepath.suffix

        backup_filename = f"{filename}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        backup_filepath = filepath.parent.joinpath(backup_filename).with_suffix(
            extension
        )

        print(
            f"Creating backup of previous version of {filepath.name} at {backup_filepath}"
        )

        shutil.copy(filepath, backup_filepath)
    else:
        print(f"{filepath.name} written")

    return filepath


def export_to_json(obj, filepath):
    """ Export the passed object to JSON in a readable format

    """
    filepath = check_and_backup(filepath)

    with open(filepath, "w") as f:
        json.dump(obj, f, indent=4)


def export_object(obj, filepath):
    """ Export the passed object to the passed filename. If the file
        already exists a backup will be made with the current timestamp
        appended to it

        Args:
            object: Object that is dry-able. These must have the toDry attribute/
        Returns:
            None
    """
    filepath = check_and_backup(filepath)

    with open(filepath, "w") as f:
        f.write(stringify(obj))


def export_all(
    social,
    network_filename="socialNetwork.json",
    source_image_json="sourceImageFilenames.json",
    entity_image_json="entityImageFilenames.json",
):
    """ Exports the JSON file holding the social network.

        Args:
            social (Social): Social network object
            network_filename (str): Filename for social network JSON file
            source_image_json (str): Filename for JSON holding source image filenames
            entity_image_json (str): Filename for JSON holding entity (people, business) image filenames
        Returns:
            None
    """
    source_names = social.sources().getRegistryForImages()

    people_dictionary = social.people().getAllForImages()
    business_dictionary = social.businesses().getAllForImages()
    # We want both in one
    people_dictionary.update(business_dictionary)

    export_object(social, network_filename)
    export_to_json(source_names, source_image_json)
    export_to_json(people_dictionary, entity_image_json)


def copy_all(
    network_filename="socialNetwork.json",
    source_image_json="sourceImageFilenames.json",
    entity_image_json="entityImageFilenames.json",
):
    """ Copy all exported files to their correct paths within the Javascript src
        directory

        Args:
            network_filename (str, defult="socialNetwork.json")
            source_image_json (str, defult="sourceImageFilenames.json")
            entity_image_json (str, defult="entityImageFilenames.json")
        Returns:
            None
    """
    network_filename_path = Path("../src") / network_filename
    source_image_path = Path("../src/data") / source_image_json
    entity_image_path = Path("../src/data") / entity_image_json

    copy_with_confirmation(network_filename, network_filename_path)
    copy_with_confirmation(source_image_json, source_image_path)
    copy_with_confirmation(entity_image_json, entity_image_path)


def copy_with_confirmation(from_path, to_path):
    """ Copy a file and if it exists get confirmation from the user

        Args:
            from_path (str, pathlib.Path): File to copy
            to_path (str, pathlib.Path): Target path
        Returns:
            None
    """
    from_path = Path(from_path)
    to_path = Path(to_path)

    if to_path.exists():
        print(f"Are you sure you want to overwrite {to_path}?")
        confirmation = input()
        if confirmation.lower() in ["y", "yes"]:
            shutil.copy(from_path, to_path)
    else:
        shutil.copy(from_path, to_path)
