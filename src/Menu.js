import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default class Menu extends React.Component {
     constructor(props) {
      super(props)
      const { condensed } = this.props
      this.state = {
        condensed: condensed,
      }
     }

     render() {
       const { toggleView, condensed } = this.props
       return (
         <div
          style={{ display: 'flex', height: '10%', width: '100%', backgroundColor: 'slategray' }}
         >
           <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox checked={condensed} onChange={() => toggleView() } color="primary"/>
              }
              label="Condensed View"
            />
           </FormGroup>
         </div>
       )
     }
}