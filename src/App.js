import React,{Component} from 'react'
import './App.css';

class PageBTN extends Component{
  render(){
    const {showAll}=this.props
    return (
      <div>
        <span className='show-all' showme={ String(showAll) } onClick={this.props.pageChange}>All</span>
        <span className='show-active' showme={ String(!showAll)} onClick={this.props.pageChange}>Active</span>
      </div>
    )
  }
}

class Item extends Component{
  render(){
    const {index,content,mark,showAll,whenClick}=this.props
    return (
      <div className="row-item" style={!showAll&&mark ? {display:'none'}:null} 
        onClick={ (e) => {
          whenClick(e,index)
        }} >
        { !mark  ?   
          <div className="input-text" >{content}</div> : 
          <div className="input-text" mark="item-checked" >
            <del>{content}</del>
          </div>
        }
        <div className="btn-delete">－</div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      input:{
        'placeholder':'What needs to be done?',
        'text':''
      },
      list:[
        {content:'todo1',mark:false},
        {content:'todo2',mark:true},
        {content:'todo3',mark:true}
      ],
      showAll:true,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.addTodo = this.addTodo.bind(this)
    this.pageChange =this.pageChange.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.buildItem = this.buildItem.bind(this)
  }

  componentDidMount(){
    const listDate = window.localStorage.getItem('todoListApp')
    if (listDate){
      this.setState({
        list:JSON.parse(listDate)
      })
    }
  }

  componentDidUpdate(prevProps,prevState){
    //如果更改前的list 和現在的list不一樣（代表有更動資料）
    if(prevState.list !== this.state.list){
      window.localStorage.setItem('todoListApp',JSON.stringify(this.state.list))
    }
  }

  handleInputChange(e){
    this.setState({
      input:{
        ...this.state.input,
        'text':e.target.value
      }
    })
  }

  addTodo(){
    let {input,list} = this.state
    if(!input.text){
      this.setState({
        input:{
          'placeholder':'I need a name for the item...',
          'text':''
        }
      })
    }else{
      this.setState({
        input:{
          'placeholder':'What needs to be done?',
          'text':''
        },
        list:[
          ...list,
          {content:input.text,mark:false}
        ]
      })      
    }
  }

  pageChange(e){
    let dontChange = e.target.getAttribute('showme') //showme=true => clickOn current Page'btn
    if( dontChange === 'false' ){
      this.setState({
        showAll:!this.state.showAll 
      })
    }   
  }

  handleItemClick(e,index){
    const clickOn = e.target
    const {list} = this.state
    let newList = [...list]     

    //mark or delete
    if( clickOn.className ==='btn-delete'){
      newList.splice(index,1)
    } else {
      newList[index].mark= !newList[index].mark
    }
    this.setState({list:newList})
  }

  buildItem(){
    const {list,showAll} = this.state
    if(list.length === 0){
      return <div id="noItem"> Add some items </div>
    }else if(!showAll && list.every(item => item.mark)){
      return <div id="noItem"> No active item </div>
    }else{
      return (
        list.map((item,i)=>(
          <Item key={i} showAll={showAll} index={i} content={item.content}
              mark={item.mark} whenClick={this.handleItemClick}
          />
        ))
      )      
    }
  }

  render(){
    const {input,list,showAll} = this.state
    return(
      <div>
        <header>todos</header>
        <div className="col-md-8 shadow rounded">
          <div className="row-addItem input-group ">
            <input type="text" className="form-control" value={input.text}
              placeholder={input.placeholder} onChange={this.handleInputChange}/>
            <button id="btn-add" className="btn btn-primary" type="button" onClick={this.addTodo} >＋</button>
          </div>

          <div className="listBlock" >{this.buildItem()}</div>

          <nav>
            <span> {list.length} items left </span>
            <PageBTN showAll={showAll} pageChange={this.pageChange} />
          </nav>
        </div>
      </div>
    )
  }
}

export default App;
