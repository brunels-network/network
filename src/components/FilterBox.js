
import React from 'react';

import styles from './FilterBox.module.css';

function null_function(args=null){}

function filterList(items, props){
  let social = props.social;

  let emitSelected = props.emitSelected;

  if (!emitSelected){
    emitSelected = null_function;
  }

  let emitToggleFilter = props.emitToggleFilter;

  if (!emitToggleFilter){
    emitToggleFilter = null_function;
  }

  let output = items.values().map((item)=>{
    let is_filtered = social.isFiltered(item);

    return <li className={styles.listItem}
               key={item.getName()}>
              <button className={styles.itemButton}
                      onClick={()=>{emitSelected(item);}}>
                {item.getName()}
              </button>
              <input className={styles.filterButton}
                     type="checkbox"
                     checked={is_filtered}
                     onChange={(event)=>{emitToggleFilter(item);}}/>
            </li>;
  });

  return <ul>{output}</ul>;
}

function FilterBox(props){
  let social = props.social;

  if (!social){
    return <div>No social to display!</div>;
  }

  let filter_text = social.getFilterText();

  let filter_info = null;

  if (filter_text){
    let emitClearFilters = props.emitClearFilters;

    if (!emitClearFilters){
      emitClearFilters = null_function;
    }

    filter_info = <div className={styles.filterContainer}>
                    <div className={styles.filterText}>
                      {filter_text}
                    </div>
                    <button className={styles.resetButton}
                            onClick={emitClearFilters}>
                      Clear Filters
                    </button>
                  </div>;
  }

  let projects = filterList(social.getProjects(false), props);
  let positions = filterList(social.getPositions(false), props);
  let affiliations = filterList(social.getAffiliations(false), props);

  return <div className={styles.container}>

          <div className={styles.listContainer}>
            <div className={styles.listTitle}>Projects</div>
            <div className={styles.listItems}>{projects}</div>
          </div>

          <div className={styles.listContainer}>
            <div className={styles.listTitle}>Positions</div>
            <div className={styles.listItems}>{positions}</div>
          </div>

          <div className={styles.listContainer}>
            <div className={styles.listTitle}>Affiliations</div>
            <div className={styles.listItems}>{affiliations}</div>
          </div>

          {filter_info}
        </div>;
}

export default FilterBox;
