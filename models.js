var mongoose = require('mongoose'),
	User, UserSchema, Track, TrackSchema;

function ready (callback) {

	mongoose.connect('mongodb://192.168.2.15/graph', function(error){
		if (error) return callback(error);
		console.log('Mongoose connected: /graph');
		callback();
	});

}; 

UserSchema = new mongoose.Schema({ 
	id: Number,
	offset: Number,
	kind: String,
	permalink: String,
	username: String,
	uri: String,
	permalink_url: String,
	avatar_url: String,
	country: String,
	full_name: String,
	description: String,
	city: String,
	discogs_name: String,
	myspace_name: String,
	website: String,
	website_title: String,
	online: Boolean,
	plan: String,
	track_count: Number,
	playlist_count: Number,
	public_favorites_count: Number,
	followers_count: Number,
	followings_count: Number,
	subscriptions: [],
	depth: {type: Number, default: 1},
	followings: [],
	followers: [],
	tracks: [],
	favorites: [],
	comments: [],
	scheduled: {type: Boolean, default: false}, 
	followingStatus: {type: Number, default: 0}, 
	followerStatus: {type: Number, default: 0}, 
	tracksStatus: {type: Number, default: 0}, 
	favoritesStatus: {type: Number, default: 0}, 
	commentsStatus: {type: Number, default: 0}, 
	number: Number
});

TrackSchema = new mongoose.Schema({
	id: Number,
	created_at: String,
	user_id: Number,
	duration: Number,
	commentable: Boolean,
	state: String,
	sharing: String,
	tag_list: String,
	permalink: String,
	description: String,
	streamable: Boolean,
	downloadable: Boolean,
	genre: String,
	release: String,
	purchase_url: String,
	label_id: String,
	label_name: String,
	isrc: String,
	video_url: String,
	track_type: String,
	key_signature: String,
	bpm: Number,
	title: String,
	release_year: String,
	release_month: String,
	release_day: String,
	original_format: String,
	original_content_size: Number,
	license: String,
	uri: String,
	permalink_url: String,
	artwork_url: String,
	waveform_url: String,
	stream_url: String,
	download_url: String,
	playback_count: Number,
	download_count: Number,
	favoritings_count: Number,
	comment_count: Number,
	created_with: {},
	attachments_uri: String,
	shared_to_count: Number,
	embeddable_by: String,
	user_favorite: Number
});

User = mongoose.model('User', UserSchema);
Track = mongoose.model('Track', TrackSchema);

module.exports = {
	ready: ready,
	User: User,
	Track: Track
};



