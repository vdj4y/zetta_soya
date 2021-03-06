import React from 'react';
import ReduxPage from 'soya/lib/page/ReduxPage';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';
import register from 'soya/lib/client/Register';
import RenderResult from 'soya/lib/page/RenderResult';
import connect from 'soya/lib/data/redux/connect';
import {routeRequirement} from '../../../../shared/routeRequirement.js';

import SupplierSegment from '../../../../segmentsAndServices/SupplierSgmSrv/SupplierSegment.js';

// component
import Navbar from '../../../../components/zetta/Navbar/Navbar.js';
import Button from '../../../../components/soya-component/dashboard/common/Button/Button.js';
import SimpleTable from '../../../../components/soya-component/dashboard/common/Table/SimpleTable/SimpleTable.js';
import PageNotificationContainer, { PageNotificationAction } from '../../../../components/soya-component/dashboard/common/PageNotification/PageNotification.js';

const FORM_ID = 'supplier';

// let sampleSuppliers = [
//   {
//     supplierName: 'PT. something',
//     marketManager: 'Dimas',
//     _id: '1234ds',
//   }
// ];
//TODO: if every comment does not use connect, remember to unsubscribe when unmount.
//TODO: actually, just unsubscribe for each components


class Component extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  componentWillMount(){
    this.actions = this.props.context.store.register(SupplierSegment);
    // this.form = new Form(this.props.context.store, FORM_ID);
    this.props.context.store.dispatch(this.actions.getSupplierListWithMarketManager());
    this.notification = new PageNotificationAction(this.props.context.reduxStore);
  }
  componentDidMount(){
    function checkForHashString(window, notification)
    {
      const hashString = window.location.href.split('#')[1];
      if(!hashString || hashString === "") return;
      const errorMessage = hashString.indexOf('errorMessage=') >= 0;
      const successMessage = hashString.indexOf('successMessage=') >= 0;
      if (errorMessage) {
        notification.showError(hashString.slice(0 + 'errorMessage='.length));
      } else if (successMessage) {
        notification.showSuccess(hashString.slice(0 + 'successMessage='.length));
      }
    }
    checkForHashString(window, this.notification);
    //add hash change event listener
    var self = this;
    window.onhashchange = () => checkForHashString(window, self.notification);

  }

  static getSegmentDependencies() {
    return [SupplierSegment];
  }

  static subscribeQueries(props, subscribe) {
    // subscribe(DashboardSgmSrv.id(), props.userId, 'dashboard');
    subscribe(SupplierSegment.id(), 'supplierWithManager', 'supplierWithManager');
  }

  handleTabClick(id){
    this.setState({showTabbed: id});
  }
  handleNotificationClose(){
    document.location.hash = "";
  }

  render(){
    const self = this;
    let showedComponent;
    // let supplierListWithManager = (this.props.result.supplierWithManager && this.props.result.supplierWithManager.length > 0 ) ? this.props.result.supplierWithManager : [];
    // supplierListWithManager = supplierListWithManager.map(s => {
    //   s.action = <Button onClick={(e) => self.props.context.store.dispatch(self.actions.deleteSupplierByName(s.supplierName) ) }>remove</Button>;
    //   return s;
    // });
    const supplierListWithManager = [
      {
        supplierName: <a onClick={ (e) => { window.location.href = "/suppliers/"+e.target.value} }>'PT. something'</a>,
        marketManager: 'Dimas',
        _id: '1234ds',
      }
    ];



    return <div>
      <Navbar context={this.props.context} active={'SUPPLIERS'} />
      {/*TODO: change window.location.href to reverseRoute*/}
      <PageNotificationContainer context={this.props.context} userHandleDismiss={this.handleNotificationClose.bind(this)}/>



      <Button onClick={(e) => {
        window.location = this.props.context.router.reverseRoute('SUPPLIER_ADD')
      }}>Add New Suppliers</Button>

      <SimpleTable
          tableBody={supplierListWithManager}
          fields={[
            {field: 'supplierName', label: `Supplier's Name`},
            {field: 'marketManager', label: 'Market Manager'},
            {field: 'action', label: 'Action'}
          ]}
          tableActionsObject={
            {supplierName: {onClick: (e) => { window.location.href = "/suppliers/"+id }}}
          }
      />
    </div>
  }
}

const SupplierConnect = connect(Component);

class SuppliersPage extends ReduxPage {
  static get pageName(){
    return 'Supplier';
  }

  static getRouteRequirements() {
    return routeRequirement;
  }

  render(httpRequest, routeArgs, store, callback){
    let reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Supplier Page</title>';
    reactRenderer.body = React.createElement(SupplierConnect, {
      context: this.createContext(store)
    });
    let renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(SuppliersPage);
export default SuppliersPage;
