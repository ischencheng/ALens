<template>
	<div class="writing">
		<!-- button 和 tip -->
		<div class="sett" style="margin: 10px 0px 10px 10px; position: relative">
			<el-space>
				<el-button type="primary" plain @click="showPrompt">
					<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
							<path fill="currentColor"
								d="M384 960v-64h192.064v64H384zm448-544a350.656 350.656 0 0 1-128.32 271.424C665.344 719.04 640 763.776 640 813.504V832H320v-14.336c0-48-19.392-95.36-57.216-124.992a351.552 351.552 0 0 1-128.448-344.256c25.344-136.448 133.888-248.128 269.76-276.48A352.384 352.384 0 0 1 832 416zm-544 32c0-132.288 75.904-224 192-224v-64c-154.432 0-256 122.752-256 288h64z">
							</path>
						</svg></el-icon><span>Prompt</span>
				</el-button>
				<el-button type="primary" plain @click="analyze">
					<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M512 64h64v192h-64V64zm0 576h64v192h-64V640zM160 480v-64h192v64H160zm576 0v-64h192v64H736zM249.856 199.04l45.248-45.184L430.848 289.6 385.6 334.848 249.856 199.104zM657.152 606.4l45.248-45.248 135.744 135.744-45.248 45.248L657.152 606.4zM114.048 923.2 68.8 877.952l316.8-316.8 45.248 45.248-316.8 316.8zM702.4 334.848 657.152 289.6l135.744-135.744 45.248 45.248L702.4 334.848z"></path></svg></el-icon><span>Analyze</span>
				</el-button>
				<el-button type="primary" plain @click="addTab(editableTabsValue2)">
					<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
							<path fill="currentColor"
								d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z">
							</path>
						</svg></el-icon><span>New Draft</span>
				</el-button>
			</el-space>
			<span id="strategy-tip" @click="showModal = true">[Strategies Tips]</span>
		</div>

		<!-- 标签页 -->
		<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab"
			style="display: block; margin: 0px 10px">
			<el-tab-pane v-for="item in editableTabs2" :key="item.name" :label="item.title" :name="item.name">
				<el-row :gutter="10">
					<!-- 左侧 -->
					<el-col :span="16">

						<textarea :id="item.name" rows="20" cols="86" @input="wordCount(item.content)"
							v-show="!item.analyzed" @focusout="wordCount(item.content)"
							placeholder="You can create your first version of the summary directly here, based on the text on the left.&#10;If you have no way to start, you can click on the prompt to display the first draft prepared for you. You can write based on it later.&#10;If you want to delete the current version, click on CLEAR.&#10;If you want to create a new version but save the current one, click New Draft.When you are done, you can click on analyze to evaluate."
							v-model="item.content"></textarea>
						<div :id="'analyzed-' + item.name" v-show="item.analyzed" class="analyzed">
							<span v-for="(s, index) in item.classifiedS" :key="index" :style="s.style">
								{{ s.content }}</span>
						</div>
					</el-col>
					<!-- 右侧 -->
					<el-col :span="8">
						<div class="final-tip">
						<ul>
							<li v-for="t,i in item.finalTip" :key="i">{{ t }}</li>
						</ul>
						</div>
					</el-col>
				</el-row>
				<el-button type="danger" size="small" round plain @click="clearContent(item)" style="margin-top: 2px">
					<el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"></path></svg></el-icon>
					<span>CLEAR</span></el-button>
				<span id="word-count">{{ wordNum }} words</span>
			</el-tab-pane>
		</el-tabs>


		<!-- 标签页 -->

		<!-- 弹窗提示 -->
		<Teleport to="body">
			<modal :show="showModal" @close="showModal = false">
				<template #header>
					<h1>Writing Strategies</h1>
				</template>
				<template #body>
					<h2>Deletion</h2>
					<p>
						To produce a summary sentence, a deletion strategy is used to remove unnecessary information in
						the sentence of the source text. Unnecessary information includes trivial details about the
						topics such as examples and scenarios or redundant information containing the rewording of some
						of the important information.
					</p>
					<h2>Sentence Combination</h2>
					<p>
						To produce a summary sentence, sentence combination is used to combine two or more
						sentences/phrases from the source text. In other words, phrases from more than one sentence are
						merged into a summary sentence. These sentences are usually combined using conjunction words,
						such as for, but, and, after, since, and before.
					</p>
					<h2>Generalization</h2>
					<p>
						The generalization rule replaces a general term for a list. There are two kinds of replacement.
						One is the replacement of a general word for a list of similar items, e.g. ‘pineapple, banana,
						star fruit and pear’ can be replaced by ‘fruits’. The other one is the replacement of a general
						word for a list of similar actions, e.g. the sentences: ‘Yang eats a pear’, and ‘Chen eats a
						banana’, can be replaced by: ‘The boys eat fruits’.
					</p>
					<h2>Paraphrasing</h2>
					<p>
						In the paraphrasing process, a word in the source sentence is replaced with a synonymous word (a
						different word with the same meaning) in the summary sentence.
					</p>
					<h2>Topic Sentence Selection (TSS)</h2>
					<p>
						To produce a summary sentence, the topic sentence selection strategy is used to extract an
						important sentence from the original text to represent the main idea of a paragraph. There are
						four methods to identify the important sentence:
					</p>
					<p>
						<b>Key method.</b> The most frequent words in a text are the most representative of its content,
						thus a segment of text containing them is more relevant. Word frequency is a method used to
						identify keywords that are non-stop-words, which occur frequently in a document . Sentences
						having keywords or content words have a greater chance of being included in the summary.
					</p>
					<p>
						<b>Location method.</b> Important sentences are normally at the beginning and the end of a
						document or paragraphs, as well as immediately below section headings. Paragraphs at the
						beginning and end of a document are more likely to contain material that is useful for a
						summary, especially the first and last sentences of the paragraphs.
					</p>
					<p>
						<b>Title method.</b> Important sentences normally contain words that are presented in the title
						and major headings of a document. Thus, words occurring in the title are good candidates for
						document specific concepts.
					</p>
					<p>
						<b>Cue method.</b> Cue phrases are words and phrases that directly signal the structure of a
						discourse. They are also known as discourse markers, discourse connectives, and discourse
						particles in computational linguistics. Cue phrases, such as “conclusion” or “in particular” are
						often followed by important information. Thus, sentences that contain one or more of these cue
						phrases are considered more important than sentences without cue phrases. These cue words are
						context dependent. However, due to the existence of different types of text, such as scientific
						articles and newspaper articles, it is difficult to collect these cue words as a unique list.
						Hence, since discourse markers can be used as an indicator of important content in a text and
						are more generic, we provide the list using discourse markers.
					</p>
					<h2>Copy–verbatim</h2>
					<p>
						In the copy-verbatim process, a summary sentence is produced from the source sentence without
						any changes. This strategy is not part of the summarizing strategies but it is used by students.
					</p>
				</template>
			</modal>
		</Teleport>
	</div>
</template>

<script src="./writing.js"></script>

<style type="text/css" scoped>
/* Style buttons */
#writing-div {
	font-size: 18px;
}

#strategy-tip {
	color: #79bbff;
	position: absolute;
	right: 10px;
	display: inline-block;
	transition: 0.3s;
	font-weight: bold;
	text-decoration: underline;
}

#strategy-tip:hover {
	color: #fff;
	background-color: #79bbff;
}

textarea {
	resize: none;
	width: 470px;
	height: 510px;
	/* margin: 0px 0px 0px 0px; */
	border-radius: 8px;
	border: none;
	padding: 0.5rem;
	color: #666;
	box-shadow: inset 0 0 0.25rem #ddd;
}

textarea:focus {
	outline: none;
	border: 1px solid #ddd;
	box-shadow: inset 0 0 0.95rem #ddd;
}

textarea[placeholder] {
	font-style: italic;
	font-size: 18px;
	line-height: 30px;
}

.analyzed {
	font-style: italic;
	font-size: 18px;
	line-height: 40px;
	/* width: 470px; */
	height: 510px;
	/* margin: 0px 0px 0px 10px; */

	border-radius: 8px;
	border: none;
	padding: 0.5rem;
	color: #666;
	box-shadow: inset 0 0 0.95rem #ddd;
	overflow: auto;
}

.final-tip {
	font-style: italic;
	font-size: 18px;
	/* width: 470px; */
	height: 510px;
	/* margin: 0px 10px 0px 0px; */

	border-radius: 8px;
	/* border: none; */
	padding: 0.5rem;
	color: #666;
	box-shadow: inset 0 0 0.95rem #ddd;
	overflow: auto;
}

#word-count {
	position: absolute;
	right: 10px;
}

div.el-tabs__nav-scroll {
	margin-left: 10px;
}
</style>