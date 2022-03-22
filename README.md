
### A project to visualize the connections between people involved in the construction of Isambard Kingdom Brunel's great steamships, the SS Great Western, SS Great Britain and SS Great Eastern.

This branch is used to build the kiosk display.

This project uses data taken from correspondence between those involveed in the construction of the three great steam ships to create a historical social network with Isambard Kingdom Brunel at its centre. Using a d3-force graph this social network can be visualised and connections between the people involved in the construction can be examined. Biographies of those involved in the construction are available to read along with the sources in which the connections between individuals and companies were found.

To use the network please visit [https://brunels-network.github.io/network/](https://brunels-network.github.io/network/)

## Run

To run this software locally you'll need to [install npm](https://www.npmjs.com/get-npm) and then clone this repository

`git clone https://github.com/brunels-network/network.git`

Move into the `network` directory and run

`npm install`

This will download the libraries the network requires to run. Once this has completed, run

`npm start`

This will open the network in your default browser and you can use this as you would at [https://brunels-network.github.io/network/](https://brunels-network.github.io/network/).

## Updating the network

Data is stored in the `data` directory. For each ship a CSV of names, dates, positions etc is stored for each node. Connections are stored in a separate CSV. To update the data in the network, you must first change the data in these or similar CSVs before processing it using the provided Python code.

### Install Jupyter Notebook

The social network constructed from the data model is stored in the `socialNetwork.json` file in `src`. This file is created using the Python code found in `python`. An interface to this code is provided by a [Jupyter Notebook](https://jupyter.org/) interface. To use this interface you will require a recent (>= 3.6) Python installation. To install the required dependencies move into the `python` directory and run

`pip install -r requirements.txt`

or

`conda install --file requirements.txt`

You should now be able to run `jupyter notebook` and open the `load_data.ipynb` notebook to read data from CSV files.

### Read in data

Once you have the notebook open it run each cell in turn, modifying the filenames of data files if you need to. You may be asked to confirm that similarly named entities are the same person/business, this can be done with a simple y/n entry.

Once you have processed the data you can export the updated model to JSON using the `export_all` function. This function exports multiple JSON files associated with the network and creates a backup of existing files if found. To view this updated network these new files must be copied into the correct locations in the `src` directory. To to do this run the `copy_all` function and confirm the overwriting of exisiting files if asked to do so.
You should now have an updated social network that can be read in and visualised.

## Updating images

The images of people/business and sources seen in the biography and source overlays are read in from two files, `entityImageFilenames.json` and `sourceImageFilenames.json`. To update the images used place the new image files in the `src/images` directory and modify the matching `filename` record in the corresponding JSON file.
