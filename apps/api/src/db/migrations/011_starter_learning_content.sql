-- Original starter exercises: short practice, not official IELTS examinations.
-- No staff accounts, passwords, or changes to existing student progress.
ALTER TABLE listening_sections ADD COLUMN IF NOT EXISTS transcript TEXT;

INSERT INTO vocabulary(word,meaning,example_sentence,synonyms,difficulty) VALUES
('adapt','change to suit new conditions','Students adapt their study habits when their schedules change.','["adjust"]','Academic practice'),
('allocate','set aside resources for a purpose','The council allocated more money to public transport.','["assign"]','Academic practice'),
('assess','judge the quality or value of something','The survey assessed residents'' travel preferences.','["evaluate"]','Academic practice'),
('beneficial','helpful or producing a good effect','Regular reading is beneficial for language development.','["helpful"]','Academic practice'),
('coherent','logical and easy to understand','A coherent essay links its ideas clearly.','["logical"]','Academic practice'),
('consequence','a result of an action or event','One consequence of heavy traffic is poorer air quality.','["result"]','Academic practice'),
('considerable','large enough to be important','The library received considerable support from local people.','["substantial"]','Academic practice'),
('decline','become smaller or weaker','Car use declined after the new bus route opened.','["decrease"]','Academic practice'),
('diverse','including many different kinds','The university has a diverse student community.','["varied"]','Academic practice'),
('efficient','working well without wasting time or resources','An efficient timetable reduces unnecessary waiting.','["effective"]','Academic practice'),
('enhance','improve the quality of something','Feedback can enhance the quality of a student''s writing.','["improve"]','Academic practice'),
('evidence','information that supports a claim','The report provides evidence for the proposed changes.','["proof"]','Academic practice'),
('feasible','possible and practical to do','A smaller pilot project may be more feasible.','["practical"]','Academic practice'),
('fluctuate','rise and fall irregularly','Attendance can fluctuate throughout the year.','["vary"]','Academic practice'),
('implement','put a plan into action','The school implemented a new reading programme.','["introduce"]','Academic practice'),
('inevitable','certain to happen','Some changes are inevitable as technology develops.','["unavoidable"]','Academic practice'),
('mitigate','make a problem or effect less severe','Trees can mitigate the effects of urban heat.','["reduce"]','Academic practice'),
('predominant','most common or important','Cycling is the predominant mode of transport in the survey.','["main"]','Academic practice'),
('significant','important or large enough to be noticed','There was a significant increase in library visits.','["important"]','Academic practice'),
('sustainable','able to continue without exhausting resources','Sustainable farming protects the soil over time.','["lasting"]','Academic practice'),
('trend','a general direction of change','The chart shows an upward trend in enrolment.','["pattern"]','Academic practice'),
('widespread','existing in many places or among many people','The programme attracted widespread interest.','["common"]','Academic practice'),
('perspective','a particular way of thinking about something','The speaker offered a different perspective on remote work.','["viewpoint"]','Academic practice'),
('reliable','able to be trusted or depended on','Students should consult reliable sources.','["dependable"]','Academic practice')
ON CONFLICT(word) DO NOTHING;

INSERT INTO reading_tests(id,title,description,duration_minutes,is_published) VALUES
('11110000-0000-4000-8000-000000000001','Sample Reading: A Community Library','Original 8-question warm-up, not a full official IELTS test.',12,TRUE)
ON CONFLICT(id) DO NOTHING;
INSERT INTO reading_passages(id,test_id,passage_number,title,body) VALUES
('11110000-0000-4000-8000-000000000002','11110000-0000-4000-8000-000000000001',1,'A different kind of library',
'In 2019, the town of Westbridge converted an unused railway office into a community library. The project was funded by the local council and donations from residents. Initially, the library opened on three afternoons each week. By 2023, it was open every weekday, although it remained closed on weekends.

The building offers books, quiet study desks and a small meeting room. Residents can borrow books without paying a membership fee. However, they must reserve the meeting room in advance. Volunteers organise a reading club on Wednesday evenings. The club welcomes adults who want to discuss fiction; it does not provide formal language examinations.

A survey conducted in 2023 found that most visitors valued the quiet study space. Some participants also requested longer opening hours. The council decided to introduce one late opening each week for a six-month trial. It has not yet announced whether this change will become permanent.')
ON CONFLICT(id) DO NOTHING;
INSERT INTO reading_questions(passage_id,question_number,question_type,prompt,options,accepted_answers,explanation) VALUES
('11110000-0000-4000-8000-000000000002',1,'true_false_not_given','The library occupies a former railway office.','[{"label":"True","value":"true"},{"label":"False","value":"false"},{"label":"Not Given","value":"not given"}]','["true"]','The first sentence identifies the former railway office.'),
('11110000-0000-4000-8000-000000000002',2,'true_false_not_given','The library is open on Saturdays.','[{"label":"True","value":"true"},{"label":"False","value":"false"},{"label":"Not Given","value":"not given"}]','["false"]','It remains closed on weekends.'),
('11110000-0000-4000-8000-000000000002',3,'true_false_not_given','Every volunteer is a retired teacher.','[{"label":"True","value":"true"},{"label":"False","value":"false"},{"label":"Not Given","value":"not given"}]','["not given","not_given"]','The passage does not identify the professions of the volunteers.'),
('11110000-0000-4000-8000-000000000002',4,'sentence_completion','Write ONE WORD: Residents must reserve the meeting room in ____.','[]','["advance"]','The meeting room must be reserved in advance.'),
('11110000-0000-4000-8000-000000000002',5,'sentence_completion','Write ONE WORD: The reading club meets on ____ evenings.','[]','["wednesday"]','The reading club meets on Wednesday evenings.'),
('11110000-0000-4000-8000-000000000002',6,'multiple_choice','What did most survey participants value?','[{"label":"The quiet study space","value":"study"},{"label":"Weekend opening","value":"weekend"},{"label":"Formal examinations","value":"exams"}]','["study"]','Most visitors valued the quiet study space.'),
('11110000-0000-4000-8000-000000000002',7,'sentence_completion','Write ONE WORD: The late-opening trial lasts six ____.','[]','["months"]','The final paragraph specifies a six-month trial.'),
('11110000-0000-4000-8000-000000000002',8,'true_false_not_given','The council has confirmed that late opening will be permanent.','[{"label":"True","value":"true"},{"label":"False","value":"false"},{"label":"Not Given","value":"not given"}]','["false"]','No permanent decision has been announced.')
ON CONFLICT(passage_id,question_number) DO NOTHING;

INSERT INTO listening_tests(id,title,description,duration_minutes,is_published) VALUES
('11110000-0000-4000-8000-000000000003','Sample Listening: Booking a Workshop','Original browser-voice warm-up with 4 questions. Not an official recording or full IELTS test.',8,TRUE)
ON CONFLICT(id) DO NOTHING;
INSERT INTO listening_sections(id,test_id,section_number,title,instructions,transcript) VALUES
('11110000-0000-4000-8000-000000000004','11110000-0000-4000-8000-000000000003',1,'Workshop booking','Read the questions, then play the browser-voice recording. You may replay it during this warm-up.',
'Good morning. Here are the details for the community photography workshop. We originally planned to start on Monday, but the instructor is unavailable, so the first session will be on Wednesday. Classes begin at six thirty in the evening and finish at eight. The workshop costs twenty pounds, including all materials. Please bring a notebook. You do not need to bring a camera because the centre provides one. The classes will take place in room twelve, not room twenty as stated on the old poster.')
ON CONFLICT(id) DO NOTHING;
INSERT INTO listening_questions(section_id,question_number,question_type,prompt,options,accepted_answers,explanation) VALUES
('11110000-0000-4000-8000-000000000004',1,'multiple_choice','On which day does the workshop start?','[{"label":"Monday","value":"monday"},{"label":"Wednesday","value":"wednesday"},{"label":"Friday","value":"friday"}]','["wednesday"]','The speaker corrects Monday to Wednesday.'),
('11110000-0000-4000-8000-000000000004',2,'form_completion','Write a time: What time does the class begin?','[]','["6:30","6.30","six thirty","18:30","6:30 pm"]','The class begins at six thirty in the evening.'),
('11110000-0000-4000-8000-000000000004',3,'form_completion','Write ONE WORD: What should participants bring?','[]','["notebook","a notebook"]','Participants should bring a notebook.'),
('11110000-0000-4000-8000-000000000004',4,'form_completion','Write a number: In which room will the classes take place?','[]','["12","twelve"]','The room is twelve; twenty is a distractor.')
ON CONFLICT(section_id,question_number) DO NOTHING;

INSERT INTO writing_tasks(id,title,task_type,category,prompt,time_limit_minutes,is_published) VALUES
('11110000-0000-4000-8000-000000000005','Sample Task 2: Working from Home','task_2','opinion essay','Some people believe that working from home benefits both employees and employers. Others believe it creates more problems than advantages. Discuss both views and give your own opinion. Write at least 250 words. This is an original practice prompt, not an official IELTS question.',40,TRUE),
('11110000-0000-4000-8000-000000000006','Sample Task 2: Public Transport','task_2','advantages and disadvantages','More cities are introducing free public transport for residents. What are the advantages and disadvantages of this approach? Write at least 250 words. This is an original practice prompt.',40,TRUE),
('11110000-0000-4000-8000-000000000007','Sample Academic Task 1: Library Visits','task_1','table report',E'The table below shows monthly visits to three libraries in 2020 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.\n\nLibrary | 2020 | 2025\nCentral | 1200 | 1800\nRiverside | 800 | 1100\nHillview | 600 | 550\n\nOriginal practice data; not an official IELTS question.',20,TRUE)
ON CONFLICT(id) DO NOTHING;
INSERT INTO speaking_tests(id,title,instructions,is_published) VALUES
('11110000-0000-4000-8000-000000000008','Sample Speaking: Learning and Daily Life','Original Part 1, 2 and 3 practice. Read the prompts and rehearse aloud. Recording storage on free hosting is temporary; AI assessment needs a configured provider.',TRUE)
ON CONFLICT(id) DO NOTHING;
INSERT INTO speaking_questions(test_id,part,question_number,prompt,cue_points,preparation_seconds,response_seconds) VALUES
('11110000-0000-4000-8000-000000000008','part_1',1,'What do you enjoy about the area where you live?','[]',0,45),
('11110000-0000-4000-8000-000000000008','part_1',2,'Do you prefer studying alone or with other people? Why?','[]',0,45),
('11110000-0000-4000-8000-000000000008','part_2',1,'Describe a skill you would like to learn.','["what the skill is","why you want to learn it","how you would learn it","how it could help you"]',60,120),
('11110000-0000-4000-8000-000000000008','part_3',1,'How has technology changed the way people learn new skills?','[]',0,90),
('11110000-0000-4000-8000-000000000008','part_3',2,'Should schools teach more practical skills? Why or why not?','[]',0,90)
ON CONFLICT(test_id,part,question_number) DO NOTHING;
