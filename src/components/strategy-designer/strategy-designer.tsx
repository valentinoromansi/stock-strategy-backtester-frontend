import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { IconButton } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';



type PropsType = {
  selectedStrategy: Strategy
}

type StateType = {
	sidebarVisible: boolean
}

class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  constructor(props: PropsType) {
    super(props);
		this.state = {
			sidebarVisible: true
		}
  }


	toogleSidebar() {
		this.setState({sidebarVisible: !this.state.sidebarVisible})
	}


  render() {
		const sidebarClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarVisible : styles.strategyDesignerSidebarHidden
		const sidebarToggleButtonClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarToogleButtonVisible : styles.strategyDesignerSidebarToogleButtonHidden

    return (
			<div className={styles.strategyDesignerWrapper}>
				<div className={sidebarClass}>
					<IconButton className={sidebarToggleButtonClass} onClick={() => { this.toogleSidebar()}} color="primary" aria-label="add to shopping cart">
        		<AddShoppingCartIcon />
      		</IconButton>
				</div>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesigner);
