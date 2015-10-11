var blacklist = require('blacklist');
var classnames = require('classnames');
var React = require('react');
var ReactIScroll = require('react-iscroll');
var iScroll = require('iscroll/build/iscroll-probe')

function hasChildrenWithVerticalFill(children) {
	var result = false;

	React.Children.forEach(children, (c) => {
		if (result) return; // early-exit
		if (!c) return;
		if (!c.type) return

		result = !!c.type.shouldFillVerticalSpace;
	});

	return result;
}

var Container = React.createClass({
	propTypes: {
		align: React.PropTypes.oneOf(['end', 'center', 'start']),
		direction: React.PropTypes.oneOf(['column', 'row']),
		fill: React.PropTypes.bool,
		grow: React.PropTypes.bool,
		justify: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.oneOf(['end', 'center', 'start'])
		]),
		scrollable: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.object
		])
	},
	componentDidMount () {
		if (this.props.scrollable && this.props.scrollable.mount) {
			this.props.scrollable.mount(this);
		}
	},
	componentWillUnmount () {
		if (this.props.scrollable && this.props.scrollable.unmount) {
			this.props.scrollable.unmount(this);
		}
	},
	render () {
		var direction = this.props.direction;
		if (!direction) {
			if (hasChildrenWithVerticalFill(this.props.children)) {
				direction = 'column';
			}
		}

		var fill = this.props.fill;
		if (direction === 'column' || this.props.scrollable) {
			fill = true;
		}

		var align = this.props.align;
		if (direction === 'column' && align === 'top') align = 'start';
		if (direction === 'column' && align === 'bottom') align = 'end';
		if (direction === 'row' && align === 'left') align = 'start';
		if (direction === 'row' && align === 'right') align = 'end';

		var className = classnames(this.props.className, {
			'Container--fill': fill,
			'Container--direction-column': direction === 'column',
			'Container--direction-row': direction === 'row',
			'Container--align-center': align === 'center',
			'Container--align-start': align === 'start',
			'Container--align-end': align === 'end',
			'Container--justify-center': this.props.justify === 'center',
			'Container--justify-start': this.props.justify === 'start',
			'Container--justify-end': this.props.justify === 'end',
			'Container--justified': this.props.justify === true,
			'Container--scrollable': this.props.scrollable && !this.props.iScroll
		});

		var props = blacklist(this.props, 'className', 'direction', 'fill', 'justify', 'scrollable');
		return (
			<div className={className} {...props}>
			 {
			 	this.props.scrollable && this.props.iScroll ?
			 	<ReactIScroll iscroll={iScroll}
                     	onScroll={this.onScroll}
                      options={this.props.options}
                     	onScrollEnd={this.onScrollEnd}
                     	onScrollStart={this.onScrollEnd}>
           {this.props.children}
        </ReactIScroll> : this.props.children
			 }
			</div>
		);
	},
	onScrollStart(e) {
		if (this.props.onScrollStart) {
			this.props.onScrollStart(e);
		}
	},
	onScroll(e) {
		if (this.props.onScroll) {
			this.props.onScroll(e);
		}
	},
	onScrollEnd(e) {
		if (this.props.onScrollEnd) {
			this.props.onScrollEnd(e);
		}
	}
});

function initScrollable(defaultPos) {
	if (!defaultPos) {
		defaultPos = {};
	}
	var pos;
	var scrollable = {
		reset () {
			pos = { left: defaultPos.left || 0, top: defaultPos.top || 0 };
		},
		getPos () {
			return { left: pos.left, top: pos.top };
		},
		mount (element) {
			console.log(element)
			var node = React.findDOMNode(element);
			node.scrollLeft = pos.left;
			node.scrollTop = pos.top;
		},
		unmount (element) {
			var node = React.findDOMNode(element);
			pos.left = node.scrollLeft;
			pos.top = node.scrollTop;
		}
	};
	scrollable.reset();
	return scrollable;
}

Container.initScrollable = initScrollable;

export default Container;
